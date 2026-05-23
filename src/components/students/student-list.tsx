
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Phone, Calendar, Music2 } from "lucide-react"
import { getStudents } from "@/lib/actions/student"
import { WhatsAppButton } from "./whatsapp-button"

interface Student {
    id: string
    name: string
    isActive: boolean
    parentName?: string | null
    phone?: string | null
    schedules: { day: string }[]
}

const DAY_SHORT: Record<string, string> = {
    MON: 'Mo', TUE: 'Tu', WED: 'We', THU: 'Th', FRI: 'Fr', SAT: 'Sa', SUN: 'Su'
}

const AVATAR_GRADIENTS = [
    'from-violet-500 to-purple-700',
    'from-teal-500  to-cyan-700',
    'from-blue-500  to-indigo-700',
    'from-amber-500 to-orange-700',
    'from-emerald-500 to-green-700',
    'from-pink-500  to-rose-700',
]

export async function StudentList({ query, sort }: { query?: string; sort?: string }) {
    const students = await getStudents(query, sort) as unknown as Student[]

    if (students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Music2 className="h-7 w-7 text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No students found</h3>
                <p className="text-muted-foreground text-sm mb-5">Start building your studio roster.</p>
                <Link
                    href="/students/new"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white btn-premium"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))',
                        boxShadow: '0 4px 16px oklch(0.62 0.22 295 / 0.3)'
                    }}
                >
                    Add First Student →
                </Link>
            </div>
        )
    }

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student, idx) => {
                const scheduleDaysArr = student.schedules.map(s => s.day)
                const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]

                return (
                    <Link href={`/students/${student.id}`} key={student.id} prefetch={false}>
                        <div className="rounded-2xl p-4 border border-border bg-card card-hover group cursor-pointer transition-all">

                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-base bg-gradient-to-br ${grad} shrink-0 shadow-sm`}>
                                        {student.name[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                                            {student.name}
                                        </h3>
                                        {student.parentName && (
                                            <p className="text-[11px] text-muted-foreground/70 truncate">{student.parentName}</p>
                                        )}
                                    </div>
                                </div>

                                <Badge
                                    className={student.isActive
                                        ? "text-[9px] font-bold shrink-0 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100"
                                        : "text-[9px] font-bold shrink-0"
                                    }
                                    variant={student.isActive ? "outline" : "secondary"}
                                >
                                    {student.isActive ? "● Active" : "Inactive"}
                                </Badge>
                            </div>

                            {/* Details */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                                        <Phone className="h-3 w-3 shrink-0 opacity-60" />
                                        <span className="text-xs truncate">{student.phone || "No phone"}</span>
                                    </div>
                                    {student.phone && (
                                        <div onClick={e => e.preventDefault()} className="shrink-0">
                                            <WhatsAppButton phone={student.phone} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                                    <div className="flex gap-1 flex-wrap">
                                        {scheduleDaysArr.length > 0 ? scheduleDaysArr.map(day => (
                                            <span
                                                key={day}
                                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/40"
                                            >
                                                {DAY_SHORT[day] || day}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-muted-foreground/50">No schedule</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground/40">View profile</span>
                                <span className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-sm">→</span>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
