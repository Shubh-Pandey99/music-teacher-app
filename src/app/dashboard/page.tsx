import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, UserCheck, Banknote, Calendar, AlertTriangle, CreditCard } from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    if (!stats) return <div>Access Denied</div>

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 md:px-0">
            <div className="flex flex-col gap-2 animate-cinematic-in">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-slate-500 font-bold text-lg">Monitoring your studio's pulse and performance.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-cinematic-in stagger-delay-1">
                <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-2xl group transition-all duration-500 hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="h-32 w-32" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardDescription className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Total Students</CardDescription>
                        <CardTitle className="text-5xl font-black tracking-tighter">{stats.totalStudents}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                            Active members
                        </div>
                    </CardContent>
                </Card>

                <Card className="premium-card group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardDescription className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Attendance Today</CardDescription>
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                            <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.presentToday} / {stats.scheduledTodayCount}</div>
                        <p className="text-sm text-slate-500 mt-2 font-bold italic">Confirmed arrivals today</p>
                    </CardContent>
                </Card>

                <Card className="premium-card group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardDescription className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Revenue Pending</CardDescription>
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                            <Banknote className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{stats.totalPendingAmount}</div>
                        <p className="text-sm text-slate-500 mt-2 font-bold italic">Outstanding dues this month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Alerts & Progress Column */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Alerts Section */}
                    {stats.absentAlerts.length > 0 && (
                        <Card className="border-red-100 bg-red-50/30 dark:bg-red-950/20 backdrop-blur-xl shadow-2xl shadow-red-500/5 overflow-hidden animate-cinematic-in stagger-delay-2">
                            <div className="h-1.5 bg-red-500 animate-pulse" />
                            <CardHeader className="pb-6">
                                <CardTitle className="text-xl font-black flex items-center gap-3 text-red-900 dark:text-red-400 uppercase tracking-tight">
                                    <AlertTriangle className="h-6 w-6" />
                                    Critical Absences
                                </CardTitle>
                                <CardDescription className="text-red-700/70 font-bold">Action required for students missing 3+ classes consecutively.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.absentAlerts.map((alert, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-red-100 dark:border-red-900/30 shadow-sm hover:translate-x-2 transition-transform">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-700 dark:text-red-300 font-black text-xs">
                                                    {alert.name[0]}
                                                </div>
                                                <span className="font-black text-slate-900 dark:text-white text-lg">{alert.name}</span>
                                            </div>
                                            <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
                                                {alert.count} Days Risk
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Class Cycle Progress */}
                    <Card className="premium-card animate-cinematic-in stagger-delay-3">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-6">
                            <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                                <Calendar className="h-6 w-6 text-blue-500" />
                                Studio Pulse & Efficiency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[600px] overflow-y-auto px-8 custom-scrollbar">
                                {stats.studentProgress.map((student) => {
                                    const completed = student.completed
                                    const limit = student.monthlyQuota
                                    const isUnpaid = completed >= limit
                                    const remaining = Math.max(0, limit - completed)
                                    const percentage = Math.min(100, (completed / limit) * 100)
                                    const isWarning = !isUnpaid && remaining <= 2 && remaining > 0

                                    return (
                                        <div key={student.id} className="py-7 group">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">{student.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">{student.monthlyQuota} Classes / Quota</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={cn(
                                                        "text-2xl font-black tracking-tighter",
                                                        isUnpaid ? "text-red-500" : "text-slate-900 dark:text-white"
                                                    )}>
                                                        {completed}<span className="text-slate-200 dark:text-slate-700 mx-1">/</span>{limit}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4 shadow-inner">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000 ease-in-out relative",
                                                        isUnpaid ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-primary"
                                                    )}
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                {isUnpaid && <span className="text-[9px] font-black uppercase tracking-widest py-1.5 px-3 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20">Renew Immediately</span>}
                                                {isWarning && <span className="text-[9px] font-black uppercase tracking-widest py-1.5 px-3 bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/20 tracking-tighter">{remaining} Lessons Remaining</span>}
                                                {!isUnpaid && !isWarning && <span className="text-[9px] font-black uppercase tracking-widest py-1.5 px-3 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-900/10">Cycle Optimized</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column: Quick Actions & Secondary Fee Alert */}
                <div className="space-y-10 animate-cinematic-in stagger-delay-4">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 ml-1">Studio Operations</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <Button asChild size="lg" className="h-20 justify-start px-8 gap-5 rounded-3xl bg-slate-900 hover:bg-black text-white btn-premium shadow-colored group">
                                <Link href="/attendance">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                                        <UserCheck className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-black text-lg tracking-tight">Daily Roll Call</span>
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Mark Attendance</span>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-20 justify-start px-8 gap-5 rounded-3xl border-slate-200 hover:bg-slate-50 transition-all hover:translate-x-1 group">
                                <Link href="/students/new">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Users className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">Onboard Teacher</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Student Setup</span>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-20 justify-start px-8 gap-5 rounded-3xl border-slate-200 hover:bg-slate-50 transition-all hover:translate-x-1 group">
                                <Link href="/fees">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Banknote className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">Financial Ledger</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Payments</span>
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Fee Alerts Small Card */}
                    {stats.studentsWithPendingFees.length > 0 && (
                        <Card className="glass rounded-[2.5rem] border-slate-100 dark:border-slate-800/50 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <CreditCard className="h-10 w-10" />
                            </div>
                            <CardHeader className="pb-4 px-8 pt-8 relative z-10">
                                <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Payment Queue</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 space-y-5 relative z-10">
                                {stats.studentsWithPendingFees.slice(0, 4).map((s) => (
                                    <div key={s.id} className="flex justify-between items-center group/item cursor-default">
                                        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-primary transition-colors">{s.name}</span>
                                        <span className="font-black text-slate-900 dark:text-white tracking-tighter">₹{s.pending}</span>
                                    </div>
                                ))}
                                <Button variant="ghost" size="sm" asChild className="w-full text-primary font-black hover:bg-primary/5 text-xs py-6 rounded-2xl border border-dashed border-primary/20 transition-all">
                                    <Link href="/fees">Generate {stats.studentsWithPendingFees.length} Invoices</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
