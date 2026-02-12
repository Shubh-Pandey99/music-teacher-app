
"use client"

import { useState } from "react"
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

export function ReportsView({
    data,
    summary,
    month,
    year
}: {
    data: any[],
    summary: any,
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
                            {data.length > 0 ? (data.reduce((s, d) => s + (d.present / d.quota), 0) / data.length * 100).toFixed(0) : 0}%
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
                                <TableHead className="text-center">Attendance</TableHead>
                                <TableHead className="text-center">Efficiency</TableHead>
                                <TableHead className="text-right">Fee</TableHead>
                                <TableHead className="text-right">Paid</TableHead>
                                <TableHead className="text-right">Pending</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((student) => {
                                const efficiency = Math.min(100, Math.round((student.present / student.quota) * 100))
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-center">{student.present} / {student.quota}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="h-1.5 w-12 bg-secondary rounded-full overflow-hidden">
                                                    <div className={`h-full ${efficiency >= 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${efficiency}%` }} />
                                                </div>
                                                <span className="text-xs">{efficiency}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">₹{student.fee}</TableCell>
                                        <TableCell className="text-right text-green-600 font-medium">₹{student.paid}</TableCell>
                                        <TableCell className="text-right text-red-600 font-medium">₹{student.pending}</TableCell>
                                        <TableCell className="text-center">{student.status}</TableCell>
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
