
import { getMonthlyReport } from "@/lib/actions/reports"
import { ReportsView } from "@/components/reports/reports-view"
import { format } from "date-fns"

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

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Reports</h1>

                <div className="flex gap-2 items-center">
                    <div className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-md">
                        {format(new Date(currentYear, currentMonth, 1), "MMMM yyyy")}
                    </div>
                </div>
            </div>

            <ReportsView data={reportData} summary={summary} month={currentMonth} year={currentYear} />
        </div>
    )
}
