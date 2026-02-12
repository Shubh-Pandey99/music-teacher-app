
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { z } from "zod"

const PaymentSchema = z.object({
    studentId: z.string(),
    amount: z.coerce.number().min(0.01),
    monthPaidFor: z.string(), // ISO Date string for first of month
    notes: z.string().optional(),
})

export async function getFeeStatus(month: number, year: number) {
    const session = await auth()
    if (!session?.user?.id) return []

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const students = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        orderBy: { name: "asc" },
    })

    // Get payments for this month
    const payments = await prisma.payment.findMany({
        where: {
            student: { teacherId: session.user.id },
            monthPaidFor: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    })

    // Calculate status for each student
    return students.map((student) => {
        const studentPayments = payments.filter((p) => p.studentId === student.id)
        const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0)
        let status = "PENDING"

        if (totalPaid >= student.monthlyFee) {
            status = "PAID"
        } else if (totalPaid > 0) {
            status = "PARTIAL"
        }

        return {
            ...student,
            totalPaid,
            remaining: Math.max(0, student.monthlyFee - totalPaid),
            status,
        }
    })
}

export async function addPayment(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const raw = {
        studentId: formData.get("studentId"),
        amount: formData.get("amount"),
        monthPaidFor: formData.get("monthPaidFor"),
        notes: formData.get("notes"),
    }

    const validated = PaymentSchema.safeParse(raw)

    if (!validated.success) {
        throw new Error("Invalid data")
    }

    const { studentId, amount, monthPaidFor, notes } = validated.data

    // Check if full payment matches fee to set status? 
    // The schema has a `status` field on Payment model, but that might be redundant if we calculate it dynamically.
    // However, the schema definition actually had `status` on `Payment`.
    // Let's infer it or just start with PAID/PARTIAL based on amount?
    // Actually, individual payments are just "payments". The "Status" is for the *Month*.
    // The Payment model status might be "COMPLETED" or "PENDING" (if online). 
    // For manual entry, let's assume "PAID". 

    await prisma.payment.create({
        data: {
            studentId,
            amount,
            monthPaidFor: new Date(monthPaidFor),
            notes,
            status: "COMPLETED",
        },
    })

    revalidatePath("/fees")
    revalidatePath("/dashboard")
}
