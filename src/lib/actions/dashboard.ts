
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getDashboardStats() {
    const session = await auth()
    if (!session?.user?.id) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)

    // 1. Total Students
    const totalStudents = await prisma.student.count({
        where: { teacherId: session.user.id, isActive: true },
    })

    // 2. Today's Attendance
    const todaysAttendance = await prisma.attendance.findMany({
        where: {
            student: { teacherId: session.user.id },
            date: {
                gte: today,
                lt: tomorrow,
            },
            status: "PRESENT",
        },
    })

    // Get scheduled students count for today
    // This is tricky because schedule is JSON. We need to fetch all active students and filter in JS.
    const allStudents = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        select: { id: true, name: true, scheduleDays: true, monthlyFee: true, monthlyQuota: true },
    })

    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase().substring(0, 3) // MON, TUE
    const scheduledToday = allStudents.filter(s => {
        try {
            const schedule = JSON.parse(s.scheduleDays as string)
            return schedule.includes(dayName)
        } catch { return false }
    })

    // 3. Pending Fees
    // Get all payments for this month
    const payments = await prisma.payment.findMany({
        where: {
            student: { teacherId: session.user.id },
            monthPaidFor: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    })

    let totalPendingAmount = 0
    const studentsWithPendingFees = []

    for (const student of allStudents) {
        const studentPayments = payments.filter(p => p.studentId === student.id)
        const paid = studentPayments.reduce((sum, p) => sum + p.amount, 0)
        const pending = Math.max(0, student.monthlyFee - paid)

        if (pending > 0) {
            totalPendingAmount += pending
            studentsWithPendingFees.push({ ...student, pending })
        }
    }

    // 5. Monthly Class Progress
    const monthlyAttendanceCounts = await prisma.attendance.groupBy({
        by: ['studentId'],
        _count: {
            status: true,
        },
        where: {
            studentId: { in: allStudents.map(s => s.id) },
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
            status: "PRESENT",
        },
    })

    const progressMap = new Map<string, number>()
    monthlyAttendanceCounts.forEach(c => progressMap.set(c.studentId, c._count.status))

    const studentProgress = allStudents.map(s => ({
        id: s.id,
        name: s.name,
        monthlyQuota: s.monthlyQuota || 12,
        completed: progressMap.get(s.id) || 0
    }))

    // Sort by near completion first?? Or name.
    studentProgress.sort((a, b) => a.name.localeCompare(b.name))


    // 4. Consecutive Absences (Alert)
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Re-fetch only records needed for alerts
    const recordsForAlerts = await prisma.attendance.findMany({
        where: {
            studentId: { in: allStudents.map(s => s.id) },
            date: { gte: twoWeeksAgo, lt: today },
        },
        orderBy: { date: 'desc' },
        select: { studentId: true, date: true, status: true }
    })

    const alertsGrouped = new Map<string, typeof recordsForAlerts>()
    recordsForAlerts.forEach(r => {
        const records = alertsGrouped.get(r.studentId) || []
        records.push(r)
        alertsGrouped.set(r.studentId, records)
    })

    const absentAlerts = []

    for (const [studentId, records] of alertsGrouped.entries()) {
        let consecutiveAbsents = 0
        for (const r of records) {
            if (r.status === "ABSENT") consecutiveAbsents++
            else break
        }
        if (consecutiveAbsents >= 3) {
            const s = allStudents.find(s => s.id === studentId)
            if (s) absentAlerts.push({ name: s.name, count: consecutiveAbsents })
        }
    }

    return {
        totalStudents,
        presentToday: todaysAttendance.length,
        scheduledTodayCount: scheduledToday.length,
        totalPendingAmount,
        studentsWithPendingFees,
        absentAlerts,
        studentProgress,
    }
}
