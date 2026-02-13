
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

    const studentsWithPayments = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        include: {
            payments: {
                where: {
                    monthPaidFor: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            },
        },
        orderBy: { name: "asc" },
    })

    return studentsWithPayments.map((student) => {
        const totalPaid = student.payments.reduce((sum, p) => Number(sum) + (parseFloat(p.amount.toString()) || 0), 0)
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
        console.error("Payment validation failed:", validated.error.flatten())
        throw new Error("Invalid data: " + JSON.stringify(validated.error.flatten().fieldErrors))
    }

    const { studentId, amount, monthPaidFor, notes } = validated.data

    // Ownership check & Fee validation
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            payments: {
                where: {
                    monthPaidFor: new Date(monthPaidFor)
                }
            }
        }
    })

    if (!student || student.teacherId !== session.user.id) {
        throw new Error("Unauthorized or Student not found")
    }

    if (!student.isActive) {
        throw new Error("Cannot record payment for inactive student")
    }

    const currentPaid = student.payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const remaining = Number(student.monthlyFee) - currentPaid

    if (amount > remaining) {
        throw new Error(`Payment exceeds monthly fee. Remaining: ₹${remaining}`)
    }

    await prisma.payment.create({
        data: {
            studentId,
            amount,
            monthPaidFor: new Date(monthPaidFor),
            notes,
            status: "PAID",
        },
    })

    revalidatePath("/fees")
    revalidatePath("/dashboard")
}
