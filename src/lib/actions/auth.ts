"use server"

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

function getSignupErrorMessage(error: unknown) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return "Database connection failed. Please verify DATABASE_URL in your deployment settings."
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return "Unable to create account. Please check your details and try again."
        }

        return "Database request failed while creating your account. Please try again."
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
        return "Database error occurred. Please try again in a few moments."
    }

    return "Internal server error during signup"
}

export async function signup(formData: FormData) {
    // Rate limiting: 5 attempts per 15 minutes per IP (approximated by key)
    // In a real app we'd get the IP from headers
    const isAllowed = rateLimit("signup-general", 5, 15 * 60 * 1000)
    if (!isAllowed) {
        return {
            success: false as const,
            error: "Too many attempts. Please try again later.",
        }
    }

    const rawName = formData.get("name")
    const rawEmail = formData.get("email")
    const rawPassword = formData.get("password")

    const validated = signupSchema.safeParse({
        name: rawName,
        email: rawEmail,
        password: rawPassword,
    })

    if (!validated.success) {
        return {
            success: false as const,
            error: validated.error.issues[0].message,
        }
    }

    const { name, email, password } = validated.data

    try {
        const existingUser = await prisma.teacher.findUnique({
            where: { email },
        })

        if (existingUser) {
            // User enumeration protection: Generic error
            console.warn(`Signup attempt for existing email: ${email}`)
            return {
                success: false as const,
                error: "Unable to create account. Please check your details and try again.",
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.teacher.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return { success: true as const }
    } catch (error: unknown) {
        console.error("Signup error:", error)
        return {
            success: false as const,
            error: getSignupErrorMessage(error),
        }
    }
}
