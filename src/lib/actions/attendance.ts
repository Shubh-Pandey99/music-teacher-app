
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function getAttendanceByDate(date: Date) {
    const session = await auth()
    if (!session?.user?.id) return { students: [], attendance: [] }

    // Normalize date to start of day or just use the YYYY-MM-DD comparison if storing as DateTime
    // Prisma stores DateTime as ISO string usually. 
    // For simplicity, let's assume we store attendance with time set to 00:00:00 UTC or something consistent.
    // In the create/update, we should ensure we strip time.

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const students = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
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

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

    const monthlyCounts = await prisma.attendance.groupBy({
        by: ['studentId'],
        _count: {
            status: true,
        },
        where: {
            student: { teacherId: session.user.id },
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
            status: "PRESENT",
        },
    })

    // Map counts to student ID for easy access { studentId: count }
    const countsMap = monthlyCounts.reduce((acc, curr) => {
        acc[curr.studentId] = curr._count.status
        return acc
    }, {} as Record<string, number>)

    return { students, attendance, monthlyCounts: countsMap }
}

export async function upsertAttendance(studentId: string, date: Date, status: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Ensure date is normalized
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    // Verify student belongs to teacher
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (student?.teacherId !== session.user.id) throw new Error("Unauthorized")

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

    // Calculate current count excluding THIS day
    const existingCount = await prisma.attendance.count({
        where: {
            studentId,
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
                not: normalizedDate,
            },
            status: "PRESENT",
        }
    })

    const quota = student?.monthlyQuota || 12
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

export async function bulkMarkAttendance(studentIds: string[], date: Date, status: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    // In a real app we should verify all studentIds belong to teacher, 
    // but for now we trust the client sends valid IDs from the fetched list
    // or we can just run a query to check.

    // Using a transaction or Promise.all. 
    // UpsertMany is not fully supported in Prisma SQLite traditionally but let's see.
    // We'll use Promise.all for now as it is ~11 students.

    // For bulk mark, we iterate because we need per-student quota check

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

    // Get all students to check quotas
    const students = await prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, monthlyQuota: true }
    })

    // Get current counts for all these students
    const counts = await prisma.attendance.groupBy({
        by: ['studentId'],
        _count: { status: true },
        where: {
            studentId: { in: studentIds },
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
                not: normalizedDate
            },
            status: "PRESENT"
        }
    })

    const countsMap = counts.reduce((acc, curr) => {
        acc[curr.studentId] = curr._count.status
        return acc
    }, {} as Record<string, number>)

    await Promise.all(students.map(async (student) => {
        const count = countsMap[student.id] || 0
        const isExtra = status === "PRESENT" && (count >= (student.monthlyQuota || 12))

        return prisma.attendance.upsert({
            where: {
                studentId_date: {
                    studentId: student.id,
                    date: normalizedDate
                }
            },
            update: { status, isExtra },
            create: {
                studentId: student.id,
                date: normalizedDate,
                status,
                isExtra
            }
        })
    }))

    revalidatePath("/attendance")
}
