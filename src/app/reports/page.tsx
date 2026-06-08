
import { getMonthlyReport } from "@/lib/actions/reports"
import { ReportsView } from "@/components/reports/reports-view"
import { format } from "date-fns"
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string }>
}) {
    const { month, year } = await searchParams
    const now = new Date()
    const currentMonth = month ? parseInt(month) : now.getMonth()
    const currentYear = year ? parseInt(year) : now.getFullYear()

    const { reportData, summary } = await getMonthlyReport(currentMonth, currentYear)
        .catch(() => ({ reportData: [], summary: { totalCollected: 0, totalPending: 0 } }))

    // Prev/Next month navigation
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-fade-in">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-float-up">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, oklch(0.52 0.22 160), oklch(0.44 0.20 185))' }}
                        >
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Reports</h1>
                    </div>
                    <p className="text-muted-foreground font-medium pl-12">Monthly performance overview</p>
                </div>

                {/* Month Navigator */}
                <div className="flex items-center gap-1 rounded-2xl p-1 border border-border bg-card shadow-sm">
                    <Link
                        href={`/reports?month=${prevMonth}&year=${prevYear}`}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="px-4 text-sm font-bold text-foreground min-w-[130px] text-center">
                        {format(new Date(currentYear, currentMonth, 1), "MMMM yyyy")}
                    </span>
                    <Link
                        href={`/reports?month=${nextMonth}&year=${nextYear}`}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <ReportsView data={reportData} summary={summary} month={currentMonth} year={currentYear} />
        </div>
    )
}
