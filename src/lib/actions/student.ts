
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { z } from "zod"

const StudentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    parentName: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    monthlyFee: z.coerce.number().min(0, "Fee must be positive"),
    monthlyQuota: z.coerce.number().min(1).max(31, "Quota cannot exceed days in a month").default(12),
    joiningDate: z.string().nullable().optional(),
    scheduleDays: z.array(z.string()).min(1, "Select at least one day"),
})

export async function getStudents(query?: string, sort: string = "name") {
    try {
        const session = await auth()
        if (!session?.user?.id) return []

        const students = await prisma.student.findMany({
            where: {
                teacherId: session.user.id,
                OR: query
                    ? [
                        { name: { contains: query } },
                        { parentName: { contains: query } },
                    ]
                    : undefined,
            },
            include: { schedules: true },
            orderBy: sort === 'recent' ? { joiningDate: 'desc' } : { name: 'asc' },
        })
        return students
    } catch (error) {
        console.error("getStudents Error:", error)
        return []
    }
}

export async function getStudent(id: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return null

        const student = await prisma.student.findUnique({
            where: { id },
            include: { schedules: true }
        })

        if (!student || student.teacherId !== session.user.id) return null

        return student
    } catch (error) {
        console.error("getStudent Error:", error)
        return null
    }
}

import { dateUtils, getAuthorizedSession, type ActionResponse } from "@/lib/action-utils"

export async function createStudent(formData: FormData): Promise<ActionResponse> {
    try {
        const session = await getAuthorizedSession()

        const rawFormData = {
            name: formData.get("name"),
            parentName: formData.get("parentName"),
            phone: formData.get("phone"),
            monthlyFee: formData.get("monthlyFee"),
            monthlyQuota: formData.get("monthlyQuota"),
            joiningDate: formData.get("joiningDate"),
            scheduleDays: formData.getAll("scheduleDays"),
        }

        const validatedFields = StudentSchema.safeParse(rawFormData)

        if (!validatedFields.success) {
            return {
                success: false,
                validationErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>
            }
        }

        const { scheduleDays, joiningDate, ...data } = validatedFields.data

        await prisma.student.create({
            data: {
                ...data,
                teacherId: session.user.id,
                schedules: {
                    create: scheduleDays.map(day => ({ day }))
                },
                joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
            },
        })

        revalidatePath("/students")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to create student:", error)
        return { success: false, error: error.message || "An unexpected error occurred while creating the student." }
    }
}

export async function updateStudent(id: string, formData: FormData): Promise<ActionResponse> {
    try {
        const session = await getAuthorizedSession()

        const rawFormData = {
            name: formData.get("name"),
            parentName: formData.get("parentName"),
            phone: formData.get("phone"),
            monthlyFee: formData.get("monthlyFee"),
            monthlyQuota: formData.get("monthlyQuota"),
            joiningDate: formData.get("joiningDate"),
            scheduleDays: formData.getAll("scheduleDays"),
        }

        const validatedFields = StudentSchema.safeParse(rawFormData)

        if (!validatedFields.success) {
            return {
                success: false,
                validationErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>
            }
        }

        const { scheduleDays, joiningDate, ...data } = validatedFields.data

        // Verify ownership
        const existing = await prisma.student.findUnique({ where: { id } })
        if (!existing || existing.teacherId !== session.user.id) {
            return { success: false, error: "You don't have permission to update this student." }
        }

        await prisma.student.update({
            where: { id },
            data: {
                ...data,
                schedules: {
                    deleteMany: {},
                    create: scheduleDays.map(day => ({ day }))
                },
                joiningDate: joiningDate ? new Date(joiningDate) : undefined,
            },
        })

        revalidatePath("/students")
        revalidatePath(`/students/${id}`)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update student:", error)
        return { success: false, error: error.message || "An unexpected error occurred while updating the student." }
    }
}

export async function deleteStudent(id: string): Promise<ActionResponse> {
    try {
        const session = await getAuthorizedSession()

        const existing = await prisma.student.findUnique({ where: { id } })
        if (!existing || existing.teacherId !== session.user.id) {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.student.delete({ where: { id } })
        revalidatePath("/students")
        return { success: true }
    } catch (error: any) {
        console.error("deleteStudent Error:", error)
        return { success: false, error: error.message || "Failed to delete student" }
    }
}
