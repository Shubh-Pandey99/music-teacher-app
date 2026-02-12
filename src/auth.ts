
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import * as bcrypt from "bcryptjs"

import { rateLimit } from "@/lib/rate-limit"

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: env.AUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string
                const key = `login-${email}`

                if (!rateLimit(key, 5, 15 * 60 * 1000)) {
                    throw new Error("Too many login attempts. Please try again in 15 minutes.")
                }

                const user = await prisma.teacher.findUnique({
                    where: { email },
                })

                if (!user) {
                    return null
                }

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (passwordsMatch) {
                    return user
                }

                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
    },
})
