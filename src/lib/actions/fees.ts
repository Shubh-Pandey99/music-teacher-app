
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { z } from "zod"
import { dateUtils, getAuthorizedSession, type ActionResponse } from "@/lib/action-utils"

const PaymentSchema = z.object({
    studentId: z.string(),
    amount: z.coerce.number().min(0.01),
    monthPaidFor: z.string(), // ISO Date string for first of month
    notes: z.string().optional(),
})


export async function getFeeStatus(month: number, year: number) {
    try {
        const session = await auth()
        if (!session?.user?.id) return []

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
            const requiredCycles = Number(progress.totalCyclesStarted)
            const totalRequired = requiredCycles * Number(student.monthlyFee)

            const remaining = Math.max(0, totalRequired - Number(totalPaid))

            let status = "PAID"
            if (remaining > 0) {
                status = Number(totalPaid) > (totalRequired - Number(student.monthlyFee)) ? "PARTIAL" : "PENDING"
            }

            return {
                ...student,
                monthlyFee: Number(student.monthlyFee),
                totalPaid: Number(totalPaid),
                paidThisMonth: Number(paidThisMonth),
                remaining: Number(remaining),
                status,
            }
        })
    } catch (error) {
        console.error("getFeeStatus Error:", error)
        return []
    }
}

export async function addPayment(formData: FormData): Promise<ActionResponse> {
    try {
        const session = await getAuthorizedSession()

        const raw = {
            studentId: formData.get("studentId"),
            amount: formData.get("amount"),
            monthPaidFor: formData.get("monthPaidFor"),
            notes: formData.get("notes"),
        }

        const validated = PaymentSchema.safeParse(raw)
        if (!validated.success) {
            return {
                success: false,
                error: "Invalid data",
                validationErrors: validated.error.flatten().fieldErrors as Record<string, string[]>
            }
        }

        const { studentId, amount, monthPaidFor, notes } = validated.data
        const paymentDate = new Date(monthPaidFor)

        const student = await prisma.student.findUnique({
            where: { id: studentId }
        })

        if (!student || student.teacherId !== session.user.id) {
            return { success: false, error: "Unauthorized or Student not found" }
        }

        if (!student.isActive) {
            return { success: false, error: "Cannot record payment for inactive student" }
        }

        if (amount <= 0) {
            return { success: false, error: "Amount must be greater than 0" }
        }

        await prisma.payment.create({
            data: {
                studentId,
                amount: Number(amount),
                monthPaidFor: paymentDate,
                notes,
                status: "PAID",
            },
        })

        revalidatePath("/fees")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error: any) {
        console.error("addPayment Error:", error)
        return { success: false, error: error.message || "Failed to add payment" }
    }
}
