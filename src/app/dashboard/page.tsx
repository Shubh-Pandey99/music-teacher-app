
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, UserCheck, Banknote, Calendar, AlertTriangle } from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    if (!stats) return <div>Access Denied</div>

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Command Center
                </h1>
                <p className="text-slate-500 font-medium">Monitoring your studio's pulse and performance.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="relative overflow-hidden border-none bg-slate-900 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Users className="h-24 w-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Students</CardDescription>
                        <CardTitle className="text-4xl font-black">{stats.totalStudents}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                            Active members
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px]">Attendance Today</CardDescription>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.presentToday} / {stats.scheduledTodayCount}</div>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Confirmed arrivals today</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px]">Revenue Pending</CardDescription>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Banknote className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">₹{stats.totalPendingAmount}</div>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Outstanding dues this month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Alerts & Progress Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Alerts Section */}
                    {stats.absentAlerts.length > 0 && (
                        <Card className="border-red-100 bg-red-50/50 shadow-sm overflow-hidden">
                            <div className="h-1 bg-red-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-900">
                                    <AlertTriangle className="h-5 w-5" />
                                    Critical Absences
                                </CardTitle>
                                <CardDescription className="text-red-700/70">Action required for students missing 3+ classes consecutively.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.absentAlerts.map((alert, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-red-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                                                    {alert.name[0]}
                                                </div>
                                                <span className="font-bold text-slate-900">{alert.name}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-black rounded-lg uppercase tracking-tight">
                                                {alert.count} Days Risk
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Class Cycle Progress */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="border-b border-slate-50 px-6 py-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Class Cycle Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto px-6">
                                {stats.studentProgress.map((student) => {
                                    const completed = student.completed
                                    const limit = student.monthlyQuota
                                    const isUnpaid = completed >= limit
                                    const remaining = Math.max(0, limit - completed)
                                    const percentage = Math.min(100, (completed / limit) * 100)
                                    const isWarning = !isUnpaid && remaining <= 2 && remaining > 0

                                    return (
                                        <div key={student.id} className="py-5 group transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="space-y-0.5">
                                                    <h4 className="font-bold text-slate-900">{student.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.monthlyQuota} Classes / Month</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={cn(
                                                        "text-lg font-black tracking-tighter",
                                                        isUnpaid ? "text-red-600" : "text-slate-900"
                                                    )}>
                                                        {completed}<span className="text-slate-300 mx-1">/</span>{limit}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-700 ease-in-out",
                                                        isUnpaid ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-primary"
                                                    )}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                {isUnpaid && <span className="text-[9px] font-black uppercase tracking-widest py-1 px-2 bg-red-50 text-red-600 rounded-md">Renew Required</span>}
                                                {isWarning && <span className="text-[9px] font-black uppercase tracking-widest py-1 px-2 bg-yellow-50 text-yellow-600 rounded-md">{remaining} classes left</span>}
                                                {!isUnpaid && !isWarning && <span className="text-[9px] font-black uppercase tracking-widest py-1 px-2 bg-green-50 text-green-600 rounded-md">Cycle Active</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column: Quick Actions & Secondary Fee Alert */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Operations</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Button asChild size="lg" className="h-16 justify-start px-6 gap-4 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                <Link href="/attendance">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <UserCheck className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold">Roll Call</span>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-16 justify-start px-6 gap-4 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all hover:translate-x-1">
                                <Link href="/students/new">
                                    <div className="p-2 bg-slate-100 rounded-xl">
                                        <Users className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <span className="font-bold">Onboard Student</span>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-16 justify-start px-6 gap-4 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all hover:translate-x-1">
                                <Link href="/fees">
                                    <div className="p-2 bg-slate-100 rounded-xl">
                                        <Banknote className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <span className="font-bold">Manage Ledger</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Fee Alerts Small Card */}
                    {stats.studentsWithPendingFees.length > 0 && (
                        <Card className="border-slate-100 shadow-sm bg-slate-50/50">
                            <CardHeader className="pb-3 px-5 pt-5">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Payment Queue</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 space-y-3">
                                {stats.studentsWithPendingFees.slice(0, 4).map((s) => (
                                    <div key={s.id} className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-700">{s.name}</span>
                                        <span className="font-black text-slate-900 tracking-tighter">₹{s.pending}</span>
                                    </div>
                                ))}
                                <Button variant="ghost" size="sm" asChild className="w-full text-primary font-bold hover:bg-primary/5 text-xs py-5 rounded-xl border border-dashed border-primary/20">
                                    <Link href="/fees">Generate Invoices ({stats.studentsWithPendingFees.length})</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
