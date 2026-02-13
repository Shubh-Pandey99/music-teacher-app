import { auth } from "@/auth"
import { headers } from "next/headers"

export { dateUtils } from "./date-utils"

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

