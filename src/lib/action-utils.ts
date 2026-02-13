
import { auth } from "@/auth"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
    validationErrors?: Record<string, string[]>
}

/**
 * Helper to get client IP for rate limiting
 */
export async function getClientIp() {
    const h = await headers()
    const forwarded = h.get("x-forwarded-for")
    const realIp = h.get("x-real-ip")
    if (forwarded) return forwarded.split(",")[0].trim()
    if (realIp) return realIp
    return "unknown"
}

/**
 * Standard auth check for server actions
 */
export async function getAuthorizedSession() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }
    return session as { user: { id: string } } & typeof session
}

/**
 * Date normalization utilities
 */
export const dateUtils = {
    startOfDay(date: Date) {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d
    },
    endOfDay(date: Date) {
        const d = new Date(date)
        d.setHours(23, 59, 59, 999)
        return d
    },
    startOfMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
    },
    endOfMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
    }
}
