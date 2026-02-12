"use server"

import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function signup(formData: FormData) {
    // Rate limiting: 5 attempts per 15 minutes per IP (approximated by key)
    // In a real app we'd get the IP from headers
    const isAllowed = rateLimit("signup-general", 5, 15 * 60 * 1000)
    if (!isAllowed) {
        throw new Error("Too many attempts. Please try again later.")
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
        throw new Error(validated.error.issues[0].message)
    }

    const { name, email, password } = validated.data

    try {
        const existingUser = await prisma.teacher.findUnique({
            where: { email },
        })

        if (existingUser) {
            // User enumeration protection: Generic error
            console.warn(`Signup attempt for existing email: ${email}`)
            throw new Error("Unable to create account. Please check your details and try again.")
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.teacher.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return { success: true }
    } catch (error: unknown) {
        console.error("Signup error:", error)
        if (error instanceof Error && error.message === "Unable to create account. Please check your details and try again.") {
            throw error
        }
        throw new Error("Internal server error during signup")
    }
}
