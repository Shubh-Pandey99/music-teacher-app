
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { z } from "zod"
import { dateUtils } from "@/lib/action-utils"

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

    const studentsWithData = await prisma.student.findMany({
        where: { teacherId: session.user.id, isActive: true },
        include: {
            payments: true,
            attendance: { where: { status: "PRESENT" } }
        },
        orderBy: { name: "asc" },
    })

    return studentsWithData.map((student) => {
        // 1. Calculate historical paid
        const totalPaid = student.payments.reduce((sum, p) => sum + Number(p.amount), 0)

        // 2. Calculate month-specific paid
        const paidThisMonth = student.payments.filter(p => {
            const d = new Date(p.monthPaidFor)
            return d.getUTCFullYear() === year && d.getUTCMonth() === month
        }).reduce((sum, p) => sum + Number(p.amount), 0)

        // 3. Calculate cycles based on attendance
        const progress = dateUtils.getStudentProgress(student.attendance.length, student.monthlyQuota)
        const requiredCycles = progress.totalCyclesStarted
        const totalRequired = requiredCycles * Number(student.monthlyFee)

        const remaining = Math.max(0, totalRequired - totalPaid)

        let status = "PAID"
        if (remaining > 0) {
            status = totalPaid > (totalRequired - Number(student.monthlyFee)) ? "PARTIAL" : "PENDING"
        }

        return {
            ...student,
            totalPaid,
            paidThisMonth,
            remaining,
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

    // No strict enforcement against overpayment, as it counts as credit for next cycle.
    // But we still do the basic validation.
    if (amount <= 0) throw new Error("Amount must be greater than 0")

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
