
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ReportStudent {
    id: string
    name: string
    present: number
    absent: number
    quota: number
    batchProgress: number
    fee: number
    paid: number
    pending: number
    status: string
}

interface ReportSummary {
    totalCollected: number
    totalPending: number
}

export function ReportsView({
    data,
    summary,
    month,
    year
}: {
    data: ReportStudent[],
    summary: ReportSummary,
    month: number,
    year: number
}) {
    const handleExportCSV = () => {
        const headers = ["Name", "Attendance", "Quota", "Fee", "Paid", "Pending", "Status"]
        const rows = data.map(s => [
            s.name,
            s.present,
            s.quota,
            s.fee,
            s.paid,
            s.pending,
            s.status
        ])

        const csvContent =
            "data:text/csv;charset=utf-8," +
            headers.join(",") + "\n" +
            rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `report_${year}_${month + 1}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{summary.totalCollected}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">₹{summary.totalPending}</div>
                    </CardContent>
                </Card>
                <Card className="hidden lg:block">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {data.length > 0 ? (data.reduce((acc: number, curr: ReportStudent) => acc + (curr.present / curr.quota), 0) / data.length * 100).toFixed(0) : 0}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Detailed Report</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportCSV}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead className="text-center">Monthly Attendance</TableHead>
                                <TableHead className="text-center">Batch Progress</TableHead>
                                <TableHead className="text-right">Fee</TableHead>
                                <TableHead className="text-right">Monthly Paid</TableHead>
                                <TableHead className="text-right">Total Pending</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((student) => {
                                const usage = Math.min(100, Math.round((student.present / student.quota) * 100))
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium whitespace-nowrap">{student.name}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-medium">{student.present} classes</span>
                                                <div className="h-1 w-16 bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${usage}%` }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-bold text-primary">{student.batchProgress} / {student.quota}</span>
                                                <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden border">
                                                    <div
                                                        className={cn("h-full transition-all",
                                                            student.batchProgress >= student.quota ? "bg-green-500" : "bg-primary"
                                                        )}
                                                        style={{ width: `${(student.batchProgress / student.quota) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">₹{student.fee}</TableCell>
                                        <TableCell className="text-right text-green-600 font-medium">₹{student.paid}</TableCell>
                                        <TableCell className="text-right text-red-600 font-medium">₹{student.pending}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={student.status === "PAID" ? "default" : "secondary"}
                                                className={cn(
                                                    student.status === "PAID" ? "bg-green-600 hover:bg-green-700" :
                                                        student.status === "PARTIAL" ? "bg-yellow-500" : "bg-red-500"
                                                )}
                                            >
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
