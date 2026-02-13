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
 * Standard auth check for server actions
 */
export async function getAuthorizedSession() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }
    return session as { user: { id: string } } & typeof session
}

