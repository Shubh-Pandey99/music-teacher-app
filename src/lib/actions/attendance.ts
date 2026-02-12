
"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "HOLIDAY", "CANCELLED"])

const upsertAttendanceSchema = z.object({
    studentId: z.string().cuid(),
    date: z.date(),
    status: attendanceStatusSchema,
})

const bulkMarkAttendanceSchema = z.object({
    studentIds: z.array(z.string().cuid()),
    date: z.date(),
    status: attendanceStatusSchema,
})

export async function getAttendanceByDate(date: Date) {
    const session = await auth()
    if (!session?.user?.id) return { students: [], attendance: [] }

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

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

    const countsMap = monthlyCounts.reduce((acc: Record<string, number>, curr) => {
        acc[curr.studentId] = curr._count.status
        return acc
    }, {} as Record<string, number>)

    return { students, attendance, monthlyCounts: countsMap }
}

export async function upsertAttendance(rawStudentId: string, rawDate: Date, rawStatus: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const { studentId, date, status } = upsertAttendanceSchema.parse({
        studentId: rawStudentId,
        date: rawDate,
        status: rawStatus,
    })

    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { id: true, teacherId: true, monthlyQuota: true }
    })

    if (!student || student.teacherId !== session.user.id) throw new Error("Unauthorized or Student not found")

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

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

export async function bulkMarkAttendance(rawStudentIds: string[], rawDate: Date, rawStatus: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const { studentIds, date, status } = bulkMarkAttendanceSchema.parse({
        studentIds: rawStudentIds,
        date: rawDate,
        status: rawStatus,
    })

    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    // Verify ownership and get student data in one go
    const validStudents = await prisma.student.findMany({
        where: {
            id: { in: studentIds },
            teacherId: session.user.id
        },
        select: { id: true, monthlyQuota: true }
    })

    if (validStudents.length !== studentIds.length) {
        throw new Error("One or more students are not owned by you or do not exist")
    }

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

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

    const countsMap = counts.reduce((acc: Record<string, number>, curr) => {
        acc[curr.studentId] = curr._count.status
        return acc
    }, {} as Record<string, number>)

    await prisma.$transaction(
        validStudents.map((student: { id: string; monthlyQuota: number }) => {
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
        })
    )

    revalidatePath("/attendance")
}
