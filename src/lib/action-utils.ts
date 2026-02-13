
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
    },
    getStudentBillingCycle(joiningDate: Date, referenceDate: Date) {
        const join = new Date(joiningDate)
        const ref = new Date(referenceDate)
        const joinDay = join.getDate()

        // Calculate months since joining
        let monthsPassed = (ref.getFullYear() - join.getFullYear()) * 12 + (ref.getMonth() - join.getMonth())

        let cycleStart = new Date(join.getFullYear(), join.getMonth() + monthsPassed, joinDay)

        // Handle overflow for shorter months (e.g. Jan 31 -> Feb 28)
        if (cycleStart.getDate() !== joinDay) {
            cycleStart = new Date(join.getFullYear(), join.getMonth() + monthsPassed + 1, 0)
        }

        // If cycleStart is after ref, we are in the previous month's cycle
        if (cycleStart > ref) {
            monthsPassed--
            cycleStart = new Date(join.getFullYear(), join.getMonth() + monthsPassed, joinDay)
            if (cycleStart.getDate() !== joinDay) {
                cycleStart = new Date(join.getFullYear(), join.getMonth() + monthsPassed + 1, 0)
            }
        }

        cycleStart.setHours(0, 0, 0, 0)

        let nextCycleStart = new Date(join.getFullYear(), join.getMonth() + monthsPassed + 1, joinDay)
        if (nextCycleStart.getDate() !== joinDay) {
            nextCycleStart = new Date(join.getFullYear(), join.getMonth() + monthsPassed + 2, 0)
        }

        const cycleEnd = new Date(nextCycleStart)
        cycleEnd.setDate(cycleEnd.getDate() - 1)
        cycleEnd.setHours(23, 59, 59, 999)

        return { start: cycleStart, end: cycleEnd }
    }
}
