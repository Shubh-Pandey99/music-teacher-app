
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { dateUtils } from "@/lib/action-utils"

export async function getDashboardStats() {
    const session = await auth()
    if (!session?.user?.id) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)

    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase().substring(0, 3) // MON, TUE

    // 1. Total Students & Today's Scheduled
    const [totalStudents, scheduledTodayCount] = await Promise.all([
        prisma.student.count({
            where: { teacherId: session.user.id, isActive: true },
        }),
        prisma.student.count({
            where: {
                teacherId: session.user.id,
                isActive: true,
                schedules: { some: { day: dayName } }
            },
        })
    ])

    // 2. Today's Attendance count
    const presentToday = await prisma.attendance.count({
        where: {
            student: { teacherId: session.user.id },
            date: { gte: today, lt: tomorrow },
            status: "PRESENT",
        },
    })

    const windowStart = new Date(today)
    windowStart.setDate(windowStart.getDate() - 32)
    const windowEnd = new Date(today)
    windowEnd.setDate(windowEnd.getDate() + 32)

    // 3. Pending Fees & Student Progress
    // We fetch students with their payments and attendance for a window
    const studentsWithMonthData = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        include: {
            payments: {
                where: { monthPaidFor: { gte: startOfMonth, lte: endOfMonth } }
            },
            attendance: {
                where: {
                    date: { gte: windowStart, lte: windowEnd },
                    status: "PRESENT"
                }
            }
        },
        orderBy: { name: "asc" }
    })

    let totalPendingAmount = 0
    const studentsWithPendingFees = []
    const studentProgress = []

    for (const student of studentsWithMonthData) {
        const paid = student.payments.reduce((sum, p) => Number(sum) + (parseFloat(p.amount.toString()) || 0), 0)
        const pending = Math.max(0, (parseFloat(student.monthlyFee.toString()) || 0) - paid)

        if (pending > 0) {
            totalPendingAmount = Number(totalPendingAmount) + Number(pending)
            studentsWithPendingFees.push({ ...student, pending: Number(pending) })
        }

        const cycle = dateUtils.getStudentBillingCycle(student.joiningDate, today)
        const completed = student.attendance.filter(a =>
            a.date >= cycle.start &&
            a.date <= cycle.end
        ).length

        studentProgress.push({
            id: student.id,
            name: student.name,
            monthlyQuota: student.monthlyQuota || 12,
            completed
        })
    }

    // 4. Consecutive Absences (Alert)
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const recordsForAlerts = await prisma.attendance.findMany({
        where: {
            student: { teacherId: session.user.id },
            date: { gte: twoWeeksAgo, lt: today },
        },
        orderBy: { date: 'desc' },
        select: { studentId: true, status: true }
    })

    const alertsGrouped = new Map<string, string[]>()
    recordsForAlerts.forEach(r => {
        const statuses = alertsGrouped.get(r.studentId) || []
        statuses.push(r.status)
        alertsGrouped.set(r.studentId, statuses)
    })

    const absentAlerts = []

    for (const [studentId, statuses] of alertsGrouped.entries()) {
        let consecutiveAbsents = 0
        for (const status of statuses) {
            if (status === "ABSENT") consecutiveAbsents++
            else break
        }
        if (consecutiveAbsents >= 3) {
            const s = studentsWithMonthData.find(s => s.id === studentId)
            if (s) absentAlerts.push({ name: s.name, count: consecutiveAbsents })
        }
    }

    return {
        totalStudents,
        presentToday,
        scheduledTodayCount,
        totalPendingAmount,
        studentsWithPendingFees,
        absentAlerts,
        studentProgress,
    }
}
