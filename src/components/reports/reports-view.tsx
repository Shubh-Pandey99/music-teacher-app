
"use client"

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Download, TrendingUp, TrendingDown, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportStudent {
    id: string; name: string; present: number; absent: number
    quota: number; batchProgress: number; fee: number; paid: number; pending: number; status: string
}

interface ReportSummary { totalCollected: number; totalPending: number }

export function ReportsView({ data, summary, month, year }: {
    data: ReportStudent[], summary: ReportSummary, month: number, year: number
}) {
    const handleExportCSV = () => {
        const headers = ["Name", "Attendance", "Quota", "Fee", "Paid", "Pending", "Status"]
        const rows = data.map(s => [s.name, s.present, s.quota, s.fee, s.paid, s.pending, s.status])
        const csv = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n")
        const a = document.createElement("a")
        a.href = encodeURI(csv)
        a.download = `report_${year}_${month + 1}.csv`
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
    }

    const avgAtt = data.length > 0
        ? (data.reduce((a, c) => a + (c.present / c.quota), 0) / data.length * 100).toFixed(0) : "0"

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Summary cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {[
                    {
                        label: "Collected", value: `₹${Number(summary.totalCollected).toLocaleString()}`,
                        sub: "Revenue this month", icon: TrendingUp,
                        gradient: 'linear-gradient(135deg, oklch(0.52 0.18 160) 0%, oklch(0.44 0.20 185) 100%)',
                        shadow: 'oklch(0.52 0.18 160 / 0.3)'
                    },
                    {
                        label: "Pending", value: `₹${Number(summary.totalPending).toLocaleString()}`,
                        sub: "Outstanding dues", icon: TrendingDown,
                        gradient: 'linear-gradient(135deg, oklch(0.60 0.19 85) 0%, oklch(0.53 0.20 60) 100%)',
                        shadow: 'oklch(0.60 0.19 85 / 0.3)'
                    },
                    {
                        label: "Avg Attendance", value: `${avgAtt}%`,
                        sub: "Monthly rate", icon: Percent,
                        gradient: 'linear-gradient(135deg, oklch(0.55 0.22 295) 0%, oklch(0.47 0.24 270) 100%)',
                        shadow: 'oklch(0.55 0.22 295 / 0.3)'
                    },
                ].map((c, i) => (
                    <div
                        key={i}
                        className="relative overflow-hidden rounded-2xl p-5 text-white card-hover animate-float-up"
                        style={{ background: c.gradient, boxShadow: `0 6px 24px ${c.shadow}`, animationDelay: `${i * 0.06}s` }}
                    >
                        <div className="absolute top-3 right-3 opacity-10"><c.icon className="h-14 w-14" /></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">{c.label}</p>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight">{c.value}</div>
                        <p className="text-xs text-white/60 mt-1">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Detailed table */}
            <div className="rounded-2xl overflow-hidden border border-border bg-card animate-float-up stagger-4">
                <div className="flex items-center justify-between p-4 border-b border-border/60">
                    <div>
                        <h3 className="font-bold">Detailed Report</h3>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{data.length} students</p>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border border-border bg-secondary hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border/40 hover:bg-transparent">
                                {["Student", "Attendance", "Batch", "Fee", "Paid", "Pending", "Status"].map(h => (
                                    <TableHead key={h} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 whitespace-nowrap">
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((s) => {
                                const attPct  = Math.min(100, Math.round((s.present / s.quota) * 100))
                                const batchPct = Math.min(100, Math.round((s.batchProgress / s.quota) * 100))
                                const isPaid   = s.status === "PAID"
                                const isPartial = s.status === "PARTIAL"

                                return (
                                    <TableRow key={s.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-semibold text-sm whitespace-nowrap py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                                    {s.name[0]}
                                                </div>
                                                {s.name}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-center py-3.5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-bold">{s.present}</span>
                                                <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${attPct}%`, background: 'oklch(0.55 0.18 200)' }} />
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-center py-3.5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{s.batchProgress}/{s.quota}</span>
                                                <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{
                                                        width: `${batchPct}%`,
                                                        background: s.batchProgress >= s.quota ? '#10b981' : '#8b5cf6'
                                                    }} />
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right py-3.5 font-medium">₹{Number(s.fee).toLocaleString()}</TableCell>
                                        <TableCell className="text-right py-3.5 font-bold text-emerald-600 dark:text-emerald-400">₹{Number(s.paid).toLocaleString()}</TableCell>
                                        <TableCell className={cn("text-right py-3.5 font-bold", s.pending > 0 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400")}>
                                            ₹{Number(s.pending).toLocaleString()}
                                        </TableCell>

                                        <TableCell className="text-center py-3.5">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border",
                                                isPaid    && "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40",
                                                isPartial && "text-amber-700  dark:text-amber-400  bg-amber-50  dark:bg-amber-950/30  border-amber-200  dark:border-amber-800/40",
                                                !isPaid && !isPartial && "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40"
                                            )}>
                                                {s.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
