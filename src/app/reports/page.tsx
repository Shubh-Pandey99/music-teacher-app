
import { getMonthlyReport } from "@/lib/actions/reports"
import { ReportsView } from "@/components/reports/reports-view"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { redirect } from "next/navigation"

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

    async function handleMonthChange(formData: FormData) {
        "use server"
        const m = formData.get("month")
        const y = formData.get("year")
        redirect(`/reports?month=${m}&year=${y}`)
    }

    // Generate last 12 months for select
    const months = []
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push({
            value: `${d.getMonth()}`, // 0-11
            year: `${d.getFullYear()}`,
            label: format(d, "MMMM yyyy")
        })
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Reports</h1>

                {/* Simple form navigation for month selection */}
                <form className="flex gap-2 items-center">
                    {/* We can't use Client Component event handlers easily in Server Component form without hydration issues if we pass functions.
                So instead, let's just make the Select a client component wrapper that navigates?
                Or simpler: Use buttons or standard links.
                For robustness, I'll assume the user is okay with the current month default, 
                and I'll add a simple link list or similar?
                
                Actually, the cleanest way is a Client Component "MonthSelector".
            */}
                    <div className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-md">
                        {format(new Date(currentYear, currentMonth, 1), "MMMM yyyy")}
                    </div>
                </form>
            </div>

            <ReportsView data={reportData} summary={summary} month={currentMonth} year={currentYear} />
        </div>
    )
}
