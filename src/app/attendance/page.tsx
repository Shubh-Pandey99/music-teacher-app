
import { getAttendanceByDate } from "@/lib/actions/attendance"
import { AttendanceView } from "@/components/attendance/attendance-view"
import { format } from "date-fns"
import { CalendarCheck } from "lucide-react"

export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>
}) {
    const { date: dateParam } = await searchParams
    const dateStr = dateParam || format(new Date(), "yyyy-MM-dd")
    const date = new Date(dateStr + "T00:00:00")

    const result = await getAttendanceByDate(date)

    if (!result.success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-3">
                    <div className="text-4xl">⚠️</div>
                    <h2 className="text-lg font-bold text-foreground">Failed to load</h2>
                    <p className="text-muted-foreground text-sm">{result.error || "Failed to load attendance list."}</p>
                </div>
            </div>
        )
    }

    const { students, attendance, monthlyCounts } = result

    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-1 animate-float-up">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-xl"
                        style={{ background: 'linear-gradient(135deg, oklch(0.52 0.18 200), oklch(0.44 0.20 220))' }}
                    >
                        <CalendarCheck className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Attendance
                    </h1>
                </div>
                <p className="text-muted-foreground font-medium pl-12">Daily roll call & class tracking</p>
            </div>

            <AttendanceView
                students={students}
                attendance={attendance}
                monthlyCounts={monthlyCounts}
                date={date}
            />
        </div>
    )
}
