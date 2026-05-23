
import { getFeeStatus, getRecentPayments } from "@/lib/actions/fees"
import { AddPaymentDialog } from "@/components/fees/add-payment-dialog"
import { PaymentHistory } from "@/components/fees/payment-history"
import { format } from "date-fns"
import { Banknote, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function FeesPage({
    searchParams,
}: { searchParams: Promise<{ month?: string; year?: string }> }) {
    const { month, year } = await searchParams
    const now = new Date()
    const currentMonth = month ? parseInt(month) : now.getMonth()
    const currentYear  = year  ? parseInt(year)  : now.getFullYear()

    const [studentStatuses, recentPayments] = await Promise.all([
        getFeeStatus(currentMonth, currentYear),
        getRecentPayments(15)
    ])

    const monthName      = format(new Date(currentYear, currentMonth, 1), "MMMM yyyy")
    const totalPending   = studentStatuses.reduce((a, s) => a + Number(s.remaining), 0)
    const totalCollected = studentStatuses.reduce((a, s) => a + Number(s.paidThisMonth), 0)

    return (
        <div className="space-y-5 pb-24 max-w-7xl mx-auto animate-fade-in">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 animate-float-up">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg, oklch(0.60 0.19 85), oklch(0.53 0.20 60))' }}>
                            <Banknote className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Fees</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 ml-9">{monthName}</p>
                </div>
                <AddPaymentDialog students={studentStatuses} />
            </div>

            {/* Summary */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 animate-float-up stagger-1">
                {[
                    { label: "Collected", value: `₹${Number(totalCollected).toLocaleString()}`, sub: "Payments received", icon: TrendingUp, gradient: 'linear-gradient(135deg, oklch(0.52 0.18 160), oklch(0.44 0.20 185))', shadow: 'oklch(0.52 0.18 160 / 0.25)' },
                    { label: "Pending",   value: `₹${Number(totalPending).toLocaleString()}`,   sub: "Outstanding dues",  icon: TrendingDown, gradient: 'linear-gradient(135deg, oklch(0.60 0.19 85),  oklch(0.53 0.20 60))',  shadow: 'oklch(0.60 0.19 85  / 0.25)' },
                ].map((c) => (
                    <div key={c.label} className="relative overflow-hidden rounded-2xl p-5 text-white card-hover" style={{ background: c.gradient, boxShadow: `0 6px 24px ${c.shadow}` }}>
                        <div className="absolute top-3 right-3 opacity-10"><c.icon className="h-14 w-14" /></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">{c.label}</p>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight">{c.value}</div>
                        <p className="text-xs text-white/60 mt-1">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main grid */}
            <div className="grid gap-5 lg:grid-cols-2">

                {/* Student Status */}
                <div className="space-y-2 animate-float-up stagger-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 ml-0.5">Student Status</p>
                    {studentStatuses.map((student) => {
                        const isPaid    = student.status === "PAID"
                        const isPartial = student.status === "PARTIAL"
                        return (
                            <div
                                key={student.id}
                                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card transition-colors hover:bg-muted/30"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                        className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
                                        style={{
                                            background: isPaid ? 'linear-gradient(135deg, oklch(0.52 0.18 160), oklch(0.44 0.20 185))'
                                                : isPartial ? 'linear-gradient(135deg, oklch(0.60 0.19 85), oklch(0.53 0.20 60))'
                                                : 'linear-gradient(135deg, oklch(0.52 0.22 25), oklch(0.46 0.20 15))'
                                        }}
                                    >
                                        {student.name[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{student.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                            <span className="text-[11px] text-muted-foreground">₹{Number(student.monthlyFee).toLocaleString()}</span>
                                            {Number(student.remaining) > 0 && (
                                                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                                                    · ₹{Number(student.remaining).toLocaleString()} due
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border shrink-0 ml-2",
                                    isPaid    && "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40",
                                    isPartial && "text-amber-700  dark:text-amber-400  bg-amber-50  dark:bg-amber-950/30  border-amber-200  dark:border-amber-800/40",
                                    !isPaid && !isPartial && "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40"
                                )}>
                                    {student.status}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Payment History */}
                <div className="animate-float-up stagger-3">
                    <PaymentHistory payments={recentPayments} />
                </div>
            </div>
        </div>
    )
}
