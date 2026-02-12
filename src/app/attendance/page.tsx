
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

    const { students, attendance, monthlyCounts } = await getAttendanceByDate(date)

    return (
        <div className="space-y-6 pb-20">
            <AttendanceView students={students} attendance={attendance} monthlyCounts={monthlyCounts} date={date} />
        </div>
    )
}
