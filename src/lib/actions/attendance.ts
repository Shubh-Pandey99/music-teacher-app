
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



import { dateUtils, getAuthorizedSession, type ActionResponse } from "@/lib/action-utils"

export async function getAttendanceByDate(date: Date) {
    try {
        const session = await getAuthorizedSession()

        // Validate date
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date provided")
        }

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

        const allAttendance = await prisma.attendance.findMany({
            where: {
                student: { teacherId: session.user.id, isActive: true },
                status: "PRESENT",
            },
            select: { studentId: true }
        })

        const countsMap: Record<string, number> = {}
        students.forEach(s => {
            const studentPresents = allAttendance.filter(a => a.studentId === s.id).length
            const progress = dateUtils.getStudentProgress(studentPresents, s.monthlyQuota)
            countsMap[s.id] = Number(progress.progressInCycle)
        })

        return { success: true, students, attendance, monthlyCounts: countsMap }
    } catch (error: any) {
        console.error("getAttendanceByDate Error:", error)
        return { success: false, error: error.message || "Failed to load attendance data", students: [], attendance: [], monthlyCounts: {} }
    }
}

export async function upsertAttendance(rawStudentId: string, rawDate: Date, rawStatus: string): Promise<ActionResponse> {
    try {
        const session = await getAuthorizedSession()

        const { studentId, date, status } = upsertAttendanceSchema.parse({
            studentId: rawStudentId,
            date: rawDate,
            status: rawStatus,
        })

        if (isNaN(date.getTime())) {
            return { success: false, error: "Invalid date" }
        }

        const normalizedDate = dateUtils.startOfDay(date)
        const today = dateUtils.startOfDay(new Date())

        if (normalizedDate > today) {
            return { success: false, error: "Cannot mark attendance for future dates" }
        }

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { id: true, teacherId: true, monthlyQuota: true, joiningDate: true, isActive: true }
        })

        if (!student || student.teacherId !== session.user.id) {
            return { success: false, error: "Unauthorized or Student not found" }
        }

        if (!student.isActive) {
            return { success: false, error: "Cannot mark attendance for inactive student" }
        }

        if (student.joiningDate && normalizedDate < dateUtils.startOfDay(student.joiningDate)) {
            return { success: false, error: "Cannot mark attendance before student joining date" }
        }

        const existingCount = await prisma.attendance.count({
            where: {
                studentId,
                status: "PRESENT",
                date: { not: normalizedDate }
            }
        })

        const quota = student.monthlyQuota || 12
        const isExtra = status === "PRESENT" && (existingCount % quota === 0 && existingCount > 0)

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
        return { success: true }
    } catch (error: any) {
        console.error("Attendance Error:", error)
        return { success: false, error: error.message || "Something went wrong" }
    }
}
