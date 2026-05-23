
import { Users, UserCheck, Banknote, Calendar, AlertTriangle, TrendingUp, Music2 } from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    if (!stats) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3">
                <div className="text-4xl">🔒</div>
                <p className="text-muted-foreground font-medium">Access Denied</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-fade-in">

            {/* Page Header */}
            <div className="flex flex-col gap-1 animate-float-up">
                <div className="flex items-center gap-3">
                    <h1 className="page-title text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                        Dashboard
                    </h1>
                    <div className="flex items-end gap-0.5 h-6 opacity-70 hidden sm:flex">
                        <div className="music-bar" style={{ height: '50%' }} />
                        <div className="music-bar" style={{ height: '80%' }} />
                        <div className="music-bar" style={{ height: '100%' }} />
                        <div className="music-bar" style={{ height: '70%' }} />
                        <div className="music-bar" style={{ height: '45%' }} />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">Monitoring your studio&apos;s pulse and performance.</p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">

                {/* Total Students */}
                <div
                    className="relative overflow-hidden rounded-2xl p-5 text-white card-hover animate-float-up stagger-1"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.52 0.25 260) 60%, oklch(0.58 0.18 310) 100%)',
                        boxShadow: '0 6px 24px oklch(0.62 0.22 295 / 0.35)'
                    }}
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute top-3 right-3 opacity-10">
                        <Users className="h-16 w-16" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">Total Students</p>
                    <div className="stat-card-value text-4xl sm:text-5xl font-black tracking-tight">{stats.totalStudents}</div>
                    <p className="text-xs text-white/60 mt-2 font-medium">Enrolled in your studio</p>
                </div>

                {/* Today Attendance */}
                <div
                    className="relative overflow-hidden rounded-2xl p-5 text-white card-hover animate-float-up stagger-2"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.52 0.18 200) 0%, oklch(0.44 0.20 220) 100%)',
                        boxShadow: '0 6px 24px oklch(0.52 0.18 200 / 0.30)'
                    }}
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute top-3 right-3 opacity-10">
                        <UserCheck className="h-16 w-16" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">Today&apos;s Attendance</p>
                    <div className="stat-card-value text-4xl sm:text-5xl font-black tracking-tight">
                        {stats.presentToday}
                        <span className="text-white/40 text-xl sm:text-2xl mx-1">/</span>
                        <span className="text-xl sm:text-2xl">{stats.scheduledTodayCount}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-2 font-medium">Students present today</p>
                </div>

                {/* Revenue Pending */}
                <div
                    className="relative overflow-hidden rounded-2xl p-5 text-white card-hover animate-float-up stagger-3"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.60 0.19 85) 0%, oklch(0.53 0.20 60) 100%)',
                        boxShadow: '0 6px 24px oklch(0.60 0.19 85 / 0.30)'
                    }}
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute top-3 right-3 opacity-10">
                        <Banknote className="h-16 w-16" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">Revenue Pending</p>
                    <div className="stat-card-value text-3xl sm:text-4xl font-black tracking-tight">₹{stats.totalPendingAmount}</div>
                    <p className="text-xs text-white/60 mt-2 font-medium">Outstanding dues</p>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid gap-5 lg:grid-cols-3">

                {/* Left column */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Absence Alerts */}
                    {stats.absentAlerts.length > 0 && (
                        <div
                            className="rounded-2xl overflow-hidden border animate-float-up stagger-4"
                            style={{ borderColor: 'oklch(0.45 0.12 25 / 0.5)' }}
                        >
                            <div className="h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-transparent" />
                            <div className="p-4 bg-red-500/5 dark:bg-red-950/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-red-500/15 rounded-lg">
                                        <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-red-700 dark:text-red-300 text-sm">Critical Absences</h3>
                                        <p className="text-[10px] text-red-500/80 dark:text-red-400/70">3+ consecutive misses — action needed</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    {stats.absentAlerts.map((alert, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center p-2.5 rounded-xl bg-red-500/8 dark:bg-red-950/30 border border-red-500/15 dark:border-red-900/40"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-full bg-red-500/20 flex items-center justify-center font-bold text-xs text-red-600 dark:text-red-400">
                                                    {alert.name[0]}
                                                </div>
                                                <span className="font-semibold text-red-700 dark:text-red-200 text-sm">{alert.name}</span>
                                            </div>
                                            <span className="px-2.5 py-0.5 text-red-600 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-red-500/10">
                                                {alert.count} days
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Class Cycle Progress */}
                    <div className="rounded-2xl overflow-hidden border border-border bg-card animate-float-up stagger-4">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-violet-500/15 dark:bg-violet-500/20 rounded-lg">
                                    <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Class Cycle Management</h3>
                                    <p className="text-[10px] text-muted-foreground/70">Monthly quota progress</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">
                                {stats.studentProgress.length} students
                            </span>
                        </div>

                        <div className="divide-y divide-border/40 max-h-[400px] overflow-y-auto px-4">
                            {stats.studentProgress.map((student) => {
                                const completed = student.completed
                                const limit = student.monthlyQuota
                                const isComplete = completed >= limit
                                const remaining = Math.max(0, limit - completed)
                                const pct = Math.min(100, (completed / limit) * 100)
                                const isWarning = !isComplete && remaining <= 2 && remaining > 0

                                const barColor = isComplete ? '#10b981' : isWarning ? '#f59e0b' : 'var(--primary)'
                                const barGlow = isComplete ? 'rgba(16,185,129,0.35)' : isWarning ? 'rgba(245,158,11,0.35)' : 'rgba(139,92,246,0.35)'

                                return (
                                    <div key={student.id} className="py-3.5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-sm">{student.name}</h4>
                                                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-0.5">{student.monthlyQuota} / month</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn(
                                                    "text-xl font-black",
                                                    isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                                                )}>
                                                    {completed}
                                                    <span className="text-muted-foreground/30 text-sm mx-0.5">/</span>
                                                    <span className="text-sm text-muted-foreground">{limit}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-1.5">
                                            <div
                                                className="h-full rounded-full progress-bar-animated transition-all duration-700"
                                                style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barGlow}` }}
                                            />
                                        </div>

                                        <div className="flex gap-1.5">
                                            {isComplete && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                                    ✓ Cycle Done
                                                </span>
                                            )}
                                            {isWarning && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
                                                    ⚡ {remaining} left
                                                </span>
                                            )}
                                            {!isComplete && !isWarning && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-violet-700 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20">
                                                    ◉ Active
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">

                    {/* Quick Actions */}
                    <div className="animate-float-up stagger-5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-2.5 ml-0.5">Quick Actions</p>
                        <div className="space-y-2.5">
                            <Link href="/attendance" className="block">
                                <div
                                    className="flex items-center gap-3 p-3.5 rounded-2xl text-white btn-premium"
                                    style={{
                                        background: 'linear-gradient(135deg, oklch(0.55 0.22 295) 0%, oklch(0.48 0.24 270) 100%)',
                                        boxShadow: '0 4px 16px oklch(0.55 0.22 295 / 0.3)'
                                    }}
                                >
                                    <div className="p-1.5 bg-white/20 rounded-xl shrink-0">
                                        <UserCheck className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm">Take Roll Call</p>
                                        <p className="text-[10px] text-white/70">Mark today&apos;s attendance</p>
                                    </div>
                                    <div className="ml-auto text-white/60 text-sm shrink-0">→</div>
                                </div>
                            </Link>

                            {[
                                { href: "/students/new", icon: Users, label: "Add Student", sub: "Enroll new member", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-500/15" },
                                { href: "/fees", icon: Banknote, label: "Manage Fees", sub: "View payment ledger", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 dark:bg-amber-500/15" },
                                { href: "/reports", icon: TrendingUp, label: "View Reports", sub: "Monthly analytics", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-500/15" },
                            ].map((a) => (
                                <Link key={a.href} href={a.href} className="block">
                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card card-hover group cursor-pointer transition-all">
                                        <div className={`p-1.5 ${a.bg} rounded-xl shrink-0`}>
                                            <a.icon className={`h-4 w-4 ${a.color}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-foreground">{a.label}</p>
                                            <p className="text-[10px] text-muted-foreground">{a.sub}</p>
                                        </div>
                                        <div className="ml-auto text-muted-foreground/40 group-hover:translate-x-0.5 group-hover:text-foreground transition-all text-sm shrink-0">→</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Payment Queue */}
                    {stats.studentsWithPendingFees.length > 0 && (
                        <div className="rounded-2xl overflow-hidden border border-border bg-card animate-float-up">
                            <div className="h-0.5 bg-gradient-to-r from-amber-500/60 via-amber-400/30 to-transparent" />
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Payment Queue</p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
                                        {stats.studentsWithPendingFees.length}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {stats.studentsWithPendingFees.slice(0, 4).map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-700 dark:text-violet-300">
                                                    {s.name[0]}
                                                </div>
                                                <span className="font-medium text-sm">{s.name}</span>
                                            </div>
                                            <span className="font-black text-amber-600 dark:text-amber-400 text-sm">₹{s.pending}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/fees">
                                    <div className="mt-3 w-full py-2 text-center rounded-xl text-[11px] font-bold text-primary transition-all cursor-pointer hover:bg-primary/5 border border-dashed border-primary/30">
                                        Manage Payments →
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
