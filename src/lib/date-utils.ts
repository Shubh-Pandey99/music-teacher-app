
/**
 * Shared date normalization utilities for both Client and Server components
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
    getStudentProgress(presentsCount: number, quota: number) {
        const q = quota || 12
        const currentCycle = Math.floor(presentsCount / q)
        const progressInCycle = presentsCount % q
        // A new cycle starts on the 1st class, or when a full quota is finished
        const totalCyclesStarted = Math.floor(presentsCount / q) + (presentsCount % q > 0 || presentsCount === 0 ? 1 : 0)

        return {
            currentCycle,
            progressInCycle,
            totalCyclesStarted,
        }
    }
}
