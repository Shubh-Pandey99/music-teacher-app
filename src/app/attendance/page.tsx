
import { getAttendanceByDate } from "@/lib/actions/attendance"
import { AttendanceView } from "@/components/attendance/attendance-view"
import { format } from "date-fns"

export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>
}) {
    const { date: dateParam } = await searchParams
    const dateStr = dateParam || format(new Date(), "yyyy-MM-dd")
    // Handle timezone potential issues by appending T00:00:00 if needed, 
    // but "yyyy-MM-dd" parsing usually defaults to UTC or local depending on implementation.
    // Best to construct date carefully.
    const date = new Date(dateStr + "T00:00:00")

    const result = await getAttendanceByDate(date)

    if (!result.success) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-600">Error</h2>
                <p className="text-muted-foreground">{result.error || "Failed to load attendance list."}</p>
            </div>
        )
    }

    const { students, attendance, monthlyCounts } = result

    return (
        <div className="space-y-6 pb-20">
            <AttendanceView students={students} attendance={attendance} monthlyCounts={monthlyCounts} date={date} />
        </div>
    )
}
