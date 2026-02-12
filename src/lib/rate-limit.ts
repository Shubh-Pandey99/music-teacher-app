
// Simple in-memory rate limiter for server actions
const trackers = new Map<string, { count: number; expires: number }>()

/**
 * Basic rate limiting helper
 * @param key Unique key (e.g., user IP + action)
 * @param limit Max attempts
 * @param windowMs Time window in milliseconds
 * @returns boolean - true if allowed, false if limited
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now()
    const tracker = trackers.get(key)

    if (!tracker || now > tracker.expires) {
        trackers.set(key, { count: 1, expires: now + windowMs })
        return true
    }

    if (tracker.count >= limit) {
        return false
    }

    tracker.count++
    return true
}
