
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { dateUtils } from "@/lib/action-utils"

export async function getDashboardStats() {
    try {
        const session = await auth()
        if (!session?.user?.id) return null

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

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

        // 3. Pending Fees & Student Progress
        const allStudentsWithData = await prisma.student.findMany({
            where: { teacherId: session.user.id, isActive: true },
            include: {
                payments: true,
                attendance: { where: { status: "PRESENT" } }
            },
            orderBy: { name: "asc" }
        })

        let totalPendingAmount = 0
        const studentsWithPendingFees = []
        const studentProgress = []

        for (const student of allStudentsWithData) {
            // Calculate historical paid
            const totalPaid = student.payments.reduce((sum, p) => sum + Number(p.amount), 0)

            // Calculate cycles based on attendance
            const progress = dateUtils.getStudentProgress(Number(student.attendance.length), Number(student.monthlyQuota))
            const requiredCycles = Number(progress.totalCyclesStarted)
            const totalRequired = requiredCycles * Number(student.monthlyFee)

            const pending = Math.max(0, totalRequired - Number(totalPaid))

            if (pending > 0) {
                totalPendingAmount = Number(totalPendingAmount) + Number(pending)
                studentsWithPendingFees.push({
                    id: student.id,
                    name: student.name,
                    monthlyFee: Number(student.monthlyFee),
                    pending: Number(pending)
                })
            }

            studentProgress.push({
                id: student.id,
                name: student.name,
                monthlyQuota: Number(student.monthlyQuota || 12),
                completed: Number(progress.progressInCycle)
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
                const s = allStudentsWithData.find(s => s.id === studentId)
                if (s) absentAlerts.push({ name: s.name, count: consecutiveAbsents })
            }
        }

        return {
            totalStudents: Number(totalStudents),
            presentToday: Number(presentToday),
            scheduledTodayCount: Number(scheduledTodayCount),
            totalPendingAmount: Number(totalPendingAmount),
            studentsWithPendingFees,
            absentAlerts,
            studentProgress,
        }
    } catch (error) {
        console.error("getDashboardStats Error:", error)
        return null
    }
}
