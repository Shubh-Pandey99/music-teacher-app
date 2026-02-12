
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { z } from "zod"

const StudentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    parentName: z.string().optional(),
    phone: z.string().optional(),
    monthlyFee: z.coerce.number().min(0, "Fee must be positive"),
    monthlyQuota: z.coerce.number().min(1).default(12),
    joiningDate: z.string().optional(), // Will be converted to Date
    scheduleDays: z.array(z.string()).min(1, "Select at least one day"),
})

export async function getStudents(query?: string, sort: string = "name") {
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
}

export async function getStudent(id: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    const student = await prisma.student.findUnique({
        where: { id },
        include: { schedules: true }
    })

    if (!student || student.teacherId !== session.user.id) return null

    return student
}

export async function createStudent(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

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
        return { error: validatedFields.error.flatten().fieldErrors }
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
    redirect("/students")
}

export async function updateStudent(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

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
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { scheduleDays, joiningDate, ...data } = validatedFields.data

    // Verify ownership
    const existing = await prisma.student.findUnique({ where: { id } })
    if (existing?.teacherId !== session.user.id) throw new Error("Unauthorized")

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
    redirect("/students")
}

export async function deleteStudent(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const existing = await prisma.student.findUnique({ where: { id } })
    if (existing?.teacherId !== session.user.id) throw new Error("Unauthorized")

    await prisma.student.delete({ where: { id } })
    revalidatePath("/students")
}
