
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { dateUtils } from "@/lib/action-utils"

export async function getMonthlyReport(month: number, year: number) {
    const session = await auth()
    if (!session?.user?.id) return { reportData: [], summary: { totalCollected: 0, totalPending: 0 } }

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const allStudentsWithData = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        include: {
            attendance: true,
            payments: true
        },
        orderBy: { name: "asc" },
    })

    let totalCollected = 0
    let totalPending = 0

    const studentReports = allStudentsWithData.map((student) => {
        // 1. Monthly Activity
        const monthAttendance = student.attendance.filter(a =>
            a.date >= startOfMonth && a.date <= endOfMonth
        )
        const presentCount = monthAttendance.filter(a => a.status === "PRESENT").length
        const absentCount = monthAttendance.filter(a => a.status === "ABSENT").length

        const monthPayments = student.payments.filter(p =>
            p.monthPaidFor >= startOfMonth && p.monthPaidFor <= endOfMonth
        )
        const paidThisMonth = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0)

        // 2. Lifetime Status (Cycle based)
        const totalPresents = student.attendance.filter(a => a.status === "PRESENT").length
        const totalPaid = student.payments.reduce((sum, p) => sum + Number(p.amount), 0)

        const progress = dateUtils.getStudentProgress(totalPresents, student.monthlyQuota)
        const requiredCycles = progress.totalCyclesStarted
        const totalRequired = requiredCycles * Number(student.monthlyFee)

        const pending = Math.max(0, totalRequired - totalPaid)

        totalCollected += paidThisMonth
        totalPending += pending

        return {
            id: student.id,
            name: student.name,
            present: presentCount,
            absent: absentCount,
            quota: student.monthlyQuota || 12,
            fee: student.monthlyFee,
            paid: paidThisMonth,
            pending,
            status: pending === 0 ? "PAID" : totalPaid > (totalRequired - Number(student.monthlyFee)) ? "PARTIAL" : "PENDING"
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
