
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMonthlyReport(month: number, year: number) {
    const session = await auth()
    if (!session?.user?.id) return { reportData: [], summary: { totalCollected: 0, totalPending: 0 } }

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const students = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        orderBy: { name: "asc" },
    })

    // Attendance Stats
    const attendance = await prisma.attendance.findMany({
        where: {
            student: { teacherId: session.user.id },
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    })

    // Payment Stats
    const payments = await prisma.payment.findMany({
        where: {
            student: { teacherId: session.user.id },
            monthPaidFor: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    })

    let totalCollected = 0
    let totalPending = 0

    const studentReports = students.map((student) => {
        // Attendance
        const studentAttendance = attendance.filter(a => a.studentId === student.id)
        const presentCount = studentAttendance.filter(a => a.status === "PRESENT").length
        const absentCount = studentAttendance.filter(a => a.status === "ABSENT").length

        // Fees
        const studentPayments = payments.filter(p => p.studentId === student.id)
        const paid = studentPayments.reduce((sum, p) => sum + p.amount, 0)
        const pending = Math.max(0, student.monthlyFee - paid)

        totalCollected += paid
        totalPending += pending

        return {
            id: student.id,
            name: student.name,
            present: presentCount,
            absent: absentCount,
            quota: student.monthlyQuota || 12,
            fee: student.monthlyFee,
            paid,
            pending,
            status: pending === 0 ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING"
        }
    })

    return {
        reportData: studentReports,
        summary: {
            totalCollected,
            totalPending
        }
    }
}
