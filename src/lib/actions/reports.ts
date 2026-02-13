
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMonthlyReport(month: number, year: number) {
    const session = await auth()
    if (!session?.user?.id) return { reportData: [], summary: { totalCollected: 0, totalPending: 0 } }

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const studentsWithData = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        include: {
            attendance: {
                where: { date: { gte: startOfMonth, lte: endOfMonth } }
            },
            payments: {
                where: { monthPaidFor: { gte: startOfMonth, lte: endOfMonth } }
            }
        },
        orderBy: { name: "asc" },
    })

    let totalCollected = 0
    let totalPending = 0

    const studentReports = studentsWithData.map((student) => {
        // Attendance
        const presentCount = student.attendance.filter(a => a.status === "PRESENT").length
        const absentCount = student.attendance.filter(a => a.status === "ABSENT").length

        // Fees
        const paid = student.payments.reduce((sum, p) => sum + Number(p.amount), 0)
        const pending = Math.max(0, student.monthlyFee - paid)

        totalCollected = Number(totalCollected) + Number(paid)
        totalPending = Number(totalPending) + Number(pending)

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
