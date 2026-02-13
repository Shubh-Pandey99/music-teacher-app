
"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "HOLIDAY", "CANCELLED"])


const upsertAttendanceSchema = z.object({
    studentId: z.string(),
    date: z.date(),
    status: attendanceStatusSchema,
})



import { dateUtils, getAuthorizedSession } from "@/lib/action-utils"

export async function getAttendanceByDate(date: Date) {
    const session = await getAuthorizedSession()

    const startOfDay = dateUtils.startOfDay(date)
    const endOfDay = dateUtils.endOfDay(date)

    const students = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        include: { schedules: true },
        orderBy: { name: "asc" },
    })

    const attendance = await prisma.attendance.findMany({
        where: {
            student: { teacherId: session.user.id },
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    })

    const windowStart = new Date(date)
    windowStart.setDate(windowStart.getDate() - 32)
    const windowEnd = new Date(date)
    windowEnd.setDate(windowEnd.getDate() + 32)

    const allAttendance = await prisma.attendance.findMany({
        where: {
            student: { teacherId: session.user.id, isActive: true },
            date: { gte: windowStart, lte: windowEnd },
            status: "PRESENT",
        },
        select: { studentId: true, date: true }
    })

    const countsMap: Record<string, number> = {}
    students.forEach(s => {
        const cycle = dateUtils.getStudentBillingCycle(s.joiningDate, date)
        countsMap[s.id] = allAttendance.filter(a =>
            a.studentId === s.id &&
            a.date >= cycle.start &&
            a.date <= cycle.end
        ).length
    })

    return { students, attendance, monthlyCounts: countsMap }
}

export async function upsertAttendance(rawStudentId: string, rawDate: Date, rawStatus: string) {
    const session = await getAuthorizedSession()

    const { studentId, date, status } = upsertAttendanceSchema.parse({
        studentId: rawStudentId,
        date: rawDate,
        status: rawStatus,
    })

    const normalizedDate = dateUtils.startOfDay(date)
    const today = dateUtils.startOfDay(new Date())

    if (normalizedDate > today) {
        throw new Error("Cannot mark attendance for future dates")
    }

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { id: true, teacherId: true, monthlyQuota: true, joiningDate: true, isActive: true }
    })

    if (!student || student.teacherId !== session.user.id) {
        // Log generic error for unauthorized access
        throw new Error("Unauthorized or Student not found")
    }

    if (!student.isActive) {
        throw new Error("Cannot mark attendance for inactive student")
    }

    if (student.joiningDate && normalizedDate < dateUtils.startOfDay(student.joiningDate)) {
        throw new Error("Cannot mark attendance before student joining date")
    }

    const cycle = dateUtils.getStudentBillingCycle(student.joiningDate, normalizedDate)
    const existingCount = await prisma.attendance.count({
        where: {
            studentId,
            date: {
                gte: cycle.start,
                lte: cycle.end,
                not: normalizedDate,
            },
            status: "PRESENT",
        }
    })

    const quota = student.monthlyQuota || 12
    const isExtra = status === "PRESENT" && (existingCount >= quota)

    await prisma.attendance.upsert({
        where: {
            studentId_date: {
                studentId,
                date: normalizedDate,
            },
        },
        update: { status, isExtra },
        create: {
            studentId,
            date: normalizedDate,
            status,
            isExtra,
        },
    })

    revalidatePath("/attendance")
}


