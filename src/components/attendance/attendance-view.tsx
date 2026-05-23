
"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, MessageCircle, Music2 } from "lucide-react"
import { upsertAttendance } from "@/lib/actions/attendance"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { dateUtils } from "@/lib/date-utils"
import { toast } from "sonner"

type Student = {
    id: string
    name: string
    schedules: { day: string }[]
    isActive: boolean
    monthlyQuota?: number
    phone?: string | null
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

    const isScheduled = (student: Student, date: Date) => {
        const dayName = format(date, "EEE").toUpperCase()
        return student.schedules?.some(s => s.day === dayName) ?? false
    }

    const scheduledStudents = students.filter(s => isScheduled(s, date))
    const otherStudents = students.filter(s => !isScheduled(s, date))
    const getStatus = (studentId: string) => attendance.find(a => a.studentId === studentId)?.status
    const isFuture = dateUtils.startOfDay(date) > dateUtils.startOfDay(new Date())
    const presentCount = scheduledStudents.filter(s => getStatus(s.id) === "PRESENT").length

    const handleMark = (studentId: string, status: AttendanceStatus) => {
        if (isFuture) { toast.error("Cannot mark attendance for future dates"); return }
        startTransition(async () => {
            const result = await upsertAttendance(studentId, date, status)
            if (result && !result.success) toast.error(result.error || "Failed")
            else toast.success(`Marked ${status.toLowerCase()}`)
        })
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5 animate-fade-in">

            {/* Calendar */}
            <div className="w-full lg:w-auto flex-shrink-0">
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border/60">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Select Date</p>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            if (d) router.push(`/attendance?date=${format(d, "yyyy-MM-dd")}`)
                        }}
                        className="p-3"
                    />
                </div>
            </div>

            {/* Students Panel */}
            <div className="flex-1 space-y-4 min-w-0">

                {/* Date header */}
                <div className="rounded-2xl p-4 border border-border bg-card animate-float-up">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold">{format(date, "EEEE, MMMM d")}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {scheduledStudents.length} scheduled · {otherStudents.length} others
                            </p>
                        </div>
                        {scheduledStudents.length > 0 && (
                            <div className="text-right">
                                <div className="text-2xl font-black text-violet-600 dark:text-violet-400">
                                    {presentCount}
                                    <span className="text-muted-foreground/30 text-sm mx-0.5">/</span>
                                    <span className="text-lg text-muted-foreground">{scheduledStudents.length}</span>
                                </div>
                                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-bold">Present</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scheduled */}
                {scheduledStudents.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-1">Scheduled Today</p>
                        {scheduledStudents.map((student, i) => (
                            <div key={student.id} className="animate-float-up" style={{ animationDelay: `${i * 0.04}s` }}>
                                <StudentAttendanceCard
                                    student={student}
                                    status={getStatus(student.id)}
                                    onMark={handleMark}
                                    isScheduled={true}
                                    monthlyCounts={monthlyCounts}
                                    isFuture={isFuture}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Others */}
                {otherStudents.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-border/60" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Others</span>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        {otherStudents.map((student, i) => (
                            <div key={student.id} className="animate-float-up" style={{ animationDelay: `${(scheduledStudents.length + i) * 0.04}s` }}>
                                <StudentAttendanceCard
                                    student={student}
                                    status={getStatus(student.id)}
                                    onMark={handleMark}
                                    isScheduled={false}
                                    monthlyCounts={monthlyCounts}
                                    isFuture={isFuture}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {students.length === 0 && (
                    <div className="text-center py-16">
                        <Music2 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">No students found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function StudentAttendanceCard({
    student, status, onMark, isScheduled, monthlyCounts, isFuture
}: {
    student: Student
    status?: string
    onMark: (id: string, status: AttendanceStatus) => void
    isScheduled: boolean
    monthlyCounts: Record<string, number>
    isFuture?: boolean
}) {
    const limit = student.monthlyQuota || 12
    const completed = monthlyCounts[student.id] || 0
    const remaining = Math.max(0, limit - completed)
    const extra = Math.max(0, completed - limit)
    const pct = Math.min(100, (completed / limit) * 100)
    const isPresent = status === "PRESENT"
    const isAbsent = status === "ABSENT"
    const isExtra = isPresent && extra > 0
    const isWarning = !isExtra && remaining <= 2 && remaining > 0

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
            isPresent && !isExtra && "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40",
            isExtra              && "bg-violet-50  dark:bg-violet-950/20  border-violet-200  dark:border-violet-900/40",
            isAbsent             && "bg-red-50     dark:bg-red-950/20     border-red-200     dark:border-red-900/40",
            !status              && "bg-card border-border",
            !status && !isScheduled && "opacity-55"
        )}>
            {/* Avatar */}
            <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}&backgroundColor=6d28d9&textColor=fff`} />
                <AvatarFallback className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold">
                    {student.name[0]}
                </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                    <p className="font-semibold text-sm truncate">{student.name}</p>
                    {isExtra && (
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300">
                            Extra
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden max-w-[80px]">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${pct}%`,
                                background: completed >= limit ? '#10b981' : isWarning ? '#f59e0b' : '#8b5cf6',
                            }}
                        />
                    </div>
                    <span className={cn(
                        "text-[10px] font-medium",
                        completed >= limit ? "text-emerald-600 dark:text-emerald-400" :
                        isWarning ? "text-amber-600 dark:text-amber-400" :
                        "text-muted-foreground/60"
                    )}>
                        {completed}/{limit}
                    </span>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-1 shrink-0">
                {student.phone && (
                    <a
                        href={`https://wa.me/91${student.phone.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-500/10 transition-all"
                    >
                        <MessageCircle className="h-4 w-4" />
                    </a>
                )}

                <button
                    type="button"
                    onClick={() => onMark(student.id, "PRESENT")}
                    disabled={!!isFuture}
                    className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
                        isPresent
                            ? isExtra
                                ? "bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                                : "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                            : "text-emerald-600/50 hover:text-emerald-600 hover:bg-emerald-500/10"
                    )}
                >
                    <Check className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => onMark(student.id, "ABSENT")}
                    disabled={!!isFuture}
                    className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
                        isAbsent
                            ? "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                            : "text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                    )}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
