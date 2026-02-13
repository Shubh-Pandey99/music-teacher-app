
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
    getStudentProgress(presentsCount: number, quota: number, paidCycles: number = 0) {
        const q = quota || 12
        const totalPaidClasses = paidCycles * q

        // Classes beyond what has been paid for
        const remainingClasses = presentsCount - totalPaidClasses

        // Is the current usage covered by payments?
        // If remainingClasses is less than 1 quota, they are "Paid" for the current batch
        // If remainingClasses is >= 1 quota, they are "Unpaid" for at least one batch
        const isPaid = remainingClasses < q

        return {
            remainingClasses,
            quota: q,
            isPaid,
            // For the progress bar:
            // If they are paid, show their progress in the CURRENT cycle (e.g. 2/12)
            // If they are unpaid, show their total unpaid classes (e.g. 14/12)
            displayCount: isPaid ? (remainingClasses % q + (remainingClasses < 0 ? q : 0)) % q : remainingClasses,
            // Actually, the user's analogy says if 14/12 and they pay, it resets to 2/12.
            // So displayCount should be:
            // If paid: the count in the NEXT (partially filled) cycle.
            // If unpaid: the total count that needs payment.
            progressValue: isPaid ? (remainingClasses % q) : remainingClasses
        }
    }
}
