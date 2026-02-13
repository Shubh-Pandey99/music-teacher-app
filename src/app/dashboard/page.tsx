
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
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.presentToday} / {stats.scheduledTodayCount}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">₹{stats.totalPendingAmount}</div>
                        <p className="text-xs text-muted-foreground">from active students</p>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Absent Alerts */}
                <Card className={stats.absentAlerts.length > 0 ? "border-red-200 bg-red-50" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span>Attendance Alerts</span>
                        </CardTitle>
                        <CardDescription>Students with 3+ consecutive absences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.absentAlerts.length > 0 ? (
                            <ul className="space-y-2">
                                {stats.absentAlerts.map((alert, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-red-700">{alert.name}</span>
                                        <span className="text-red-600">{alert.count} days</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No alerts.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Fee Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Banknote className="h-5 w-5 text-yellow-500" />
                            <span>Unpaid Fees</span>
                        </CardTitle>
                        <CardDescription>Students with pending balance this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.studentsWithPendingFees.length > 0 ? (
                            <div className="space-y-2">
                                {stats.studentsWithPendingFees.slice(0, 5).map((s) => (
                                    <div key={s.id} className="flex justify-between items-center text-sm">
                                        <span>{s.name}</span>
                                        <span className="font-medium text-yellow-700">₹{s.pending}</span>
                                    </div>
                                ))}
                                {stats.studentsWithPendingFees.length > 5 && (
                                    <Button variant="link" size="sm" asChild className="px-0">
                                        <Link href="/fees">View all ({stats.studentsWithPendingFees.length})</Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">All clear.</p>
                        )}
                    </CardContent>
                </Card>
                {/* Student Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Class Cycle Progress
                        </CardTitle>
                        <CardDescription>Tracks progress against paid classes. Resets to next cycle after payment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {stats.studentProgress.map((student) => {
                                const completed = student.completed
                                const limit = student.monthlyQuota
                                const isUnpaid = completed >= limit
                                const remaining = Math.max(0, limit - completed)
                                const percentage = Math.min(100, (completed / limit) * 100)
                                const isWarning = !isUnpaid && remaining <= 2 && remaining > 0

                                return (
                                    <div key={student.id} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{student.name}</span>
                                            <span className={cn(
                                                "text-xs font-medium",
                                                isUnpaid ? "text-red-600" : "text-muted-foreground"
                                            )}>
                                                {completed}/{limit}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500",
                                                    isUnpaid ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-blue-600"
                                                )}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center h-4">
                                            {isUnpaid && (
                                                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-full">
                                                    Unpaid Balance
                                                </span>
                                            )}
                                            {isWarning && (
                                                <span className="text-[10px] text-yellow-600 font-bold bg-yellow-50 px-1.5 py-0.5 rounded-full">
                                                    {remaining} classes remaining
                                                </span>
                                            )}
                                            {!isUnpaid && !isWarning && (
                                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                                                    Next Cycle
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                            {stats.studentProgress.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No active students.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild size="lg" className="h-20 flex flex-col gap-1">
                        <Link href="/attendance">
                            <UserCheck className="h-6 w-6" />
                            Mark Attendance
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-20 flex flex-col gap-1">
                        <Link href="/fees">
                            <Banknote className="h-6 w-6" />
                            Add Payment
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-20 flex flex-col gap-1">
                        <Link href="/students/new">
                            <Users className="h-6 w-6" />
                            Add Student
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="h-20 flex flex-col gap-1">
                        <Link href="/reports">
                            <Calendar className="h-6 w-6" />
                            View Reports
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
