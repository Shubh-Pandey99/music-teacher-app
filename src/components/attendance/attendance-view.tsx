
"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, User } from "lucide-react"
import { upsertAttendance } from "@/lib/actions/attendance"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { dateUtils } from "@/lib/date-utils"

type Student = {
    id: string
    name: string
    schedules: { day: string }[]
    isActive: boolean
    monthlyQuota?: number
}

type AttendanceRecord = {
    studentId: string
    status: string
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "HOLIDAY" | "CANCELLED"

interface AttendanceViewProps {
    students: Student[]
    attendance: AttendanceRecord[]
    date: Date
    monthlyCounts?: Record<string, number>
}

export function AttendanceView({ students, attendance, date, monthlyCounts = {} }: AttendanceViewProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // Helper to check if student is scheduled for this day
    const isScheduled = (student: Student, date: Date) => {
        const dayName = format(date, "EEE").toUpperCase() // MON, TUE...
        return student.schedules?.some(s => s.day === dayName) ?? false
    }

    // Filter students
    const scheduledStudents = students.filter(s => isScheduled(s, date))
    const otherStudents = students.filter(s => !isScheduled(s, date))

    const getStatus = (studentId: string) => {
        return attendance.find(a => a.studentId === studentId)?.status
    }

    const isFuture = dateUtils.startOfDay(date) > dateUtils.startOfDay(new Date())

    const handleMark = (studentId: string, status: AttendanceStatus) => {
        if (isFuture) return

        startTransition(async () => {
            const result = await upsertAttendance(studentId, date, status)
            if (result && !result.success) {
                alert(result.error || "Failed to mark attendance")
            }
        })
    }



    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="w-full lg:w-auto flex-shrink-0">
                <Card className="border-none shadow-none lg:border lg:shadow-sm">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            if (d) {
                                router.push(`/attendance?date=${format(d, "yyyy-MM-dd")}`)
                            }
                        }}
                        className="rounded-md border mx-auto"
                    />
                </Card>
            </div>

            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">{format(date, "EEEE, MMMM d")}</h2>
                        <p className="text-sm text-muted-foreground">
                            {scheduledStudents.length} scheduled, {otherStudents.length} others
                        </p>
                    </div>

                </div>

                <div className="space-y-2">
                    {scheduledStudents.map(student => (
                        <StudentAttendanceCard
                            key={student.id}
                            student={student}
                            status={getStatus(student.id)}
                            onMark={handleMark}
                            isScheduled={true}
                            monthlyCounts={monthlyCounts}
                        />
                    ))}

                    {otherStudents.length > 0 && (
                        <>
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Other Students</span>
                                </div>
                            </div>
                            {otherStudents.map(student => (
                                <StudentAttendanceCard
                                    key={student.id}
                                    student={student}
                                    status={getStatus(student.id)}
                                    onMark={handleMark}
                                    isScheduled={false}
                                    monthlyCounts={monthlyCounts}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function StudentAttendanceCard({
    student,
    status,
    onMark,
    isScheduled,
    monthlyCounts
}: {
    student: Student
    status?: string
    onMark: (id: string, status: AttendanceStatus) => void
    isScheduled: boolean
    monthlyCounts: Record<string, number>
}) {
    const limit = student.monthlyQuota || 12
    const completed = monthlyCounts[student.id] || 0
    const remaining = Math.max(0, limit - completed)
    const extra = Math.max(0, completed - limit)

    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
            status === "PRESENT" && !extra && "border-green-200 bg-green-50",
            status === "PRESENT" && extra && "border-purple-200 bg-purple-50",
            status === "ABSENT" && "border-red-200 bg-red-50",
            !status && !isScheduled && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
        )}>
            <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pr-2">
                    <div className="flex justify-between items-start">
                        <p className="font-medium leading-none truncate">{student.name}</p>
                        {status === "PRESENT" && extra > 0 && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-purple-200 text-purple-700 bg-purple-100">
                                Extra
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                            <div
                                className={cn("h-full rounded-full transition-all",
                                    completed >= limit ? "bg-green-500" : remaining <= 2 ? "bg-yellow-500" : "bg-primary"
                                )}
                                style={{ width: `${Math.min(100, (completed / limit) * 100)}%` }}
                            />
                        </div>
                        <span className={cn("text-[10px]", remaining <= 2 && remaining > 0 ? "text-yellow-600 font-medium" : "text-muted-foreground")}>
                            {completed}/{limit} {completed >= limit ? "Done" : `(${remaining} left)`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <StatusButton
                    active={status === "PRESENT"}
                    onClick={() => onMark(student.id, "PRESENT")}
                    className={cn(
                        "text-green-600 hover:text-green-700 hover:bg-green-100 data-[active=true]:bg-green-600 data-[active=true]:text-white",
                        extra > 0 && "text-purple-600 hover:text-purple-700 hover:bg-purple-100 data-[active=true]:bg-purple-600"
                    )}
                >
                    <Check className="h-4 w-4" />
                </StatusButton>
                <StatusButton
                    active={status === "ABSENT"}
                    onClick={() => onMark(student.id, "ABSENT")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100 data-[active=true]:bg-red-600 data-[active=true]:text-white"
                >
                    <X className="h-4 w-4" />
                </StatusButton>
            </div>
        </div>
    )
}

function StatusButton({
    active,
    className,
    children,
    onClick
}: {
    active: boolean
    className?: string
    children: React.ReactNode
    onClick: () => void
}) {
    return (
        <button
            type="button"
            data-active={active}
            onClick={onClick}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "h-9 w-9",
                "bg-transparent shadow-none",
                className
            )}
        >
            {children}
        </button>
    )
}
