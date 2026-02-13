
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

        // Fetch ALL present attendance and ALL payments for these students to calculate their lifecycle progress
        const studentsData = await prisma.student.findMany({
            where: { teacherId: session.user.id, isActive: true },
            include: {
                attendance: { where: { status: "PRESENT" } },
                payments: true
            }
        })

        const countsMap: Record<string, number> = {}
        studentsData.forEach(s => {
            const totalPaid = s.payments.reduce((sum, p) => sum + Number(p.amount), 0)
            const paidCycles = Math.floor(totalPaid / (Number(s.monthlyFee) || 1))

            const progress = dateUtils.getStudentProgress(s.attendance.length, s.monthlyQuota, paidCycles)
            countsMap[s.id] = Number(progress.displayCount)
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
            select: { id: true, teacherId: true, monthlyQuota: true, joiningDate: true, isActive: true, monthlyFee: true }
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

        const totalPresents = await prisma.attendance.count({
            where: {
                studentId,
                status: "PRESENT",
                date: { not: normalizedDate }
            }
        })

        const totalPaid = await prisma.payment.aggregate({
            where: { studentId },
            _sum: { amount: true }
        })

        const quota = student.monthlyQuota || 12
        const paidCycles = Math.floor(Number(totalPaid._sum.amount || 0) / (Number(student.monthlyFee) || 1))

        // A class is 'Extra' if the total count (including this one if it's PRESENT) 
        // exceeds the total paid capacity.
        const isExtra = status === "PRESENT" && (totalPresents + 1 > (paidCycles * quota))

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
