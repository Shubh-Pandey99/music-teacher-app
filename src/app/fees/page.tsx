
import { getFeeStatus } from "@/lib/actions/fees"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddPaymentDialog } from "@/components/fees/add-payment-dialog"
import { format } from "date-fns"
import { Banknote } from "lucide-react"

export default async function FeesPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string }>
}) {
    const { month, year } = await searchParams
    const now = new Date()
    const currentMonth = month ? parseInt(month) : now.getMonth()
    const currentYear = year ? parseInt(year) : now.getFullYear()

    const studentStatuses = await getFeeStatus(currentMonth, currentYear)

    const monthName = format(new Date(currentYear, currentMonth, 1), "MMMM yyyy")

    const totalPending = studentStatuses.reduce((acc, s) => Number(acc) + (parseFloat(s.remaining.toString()) || 0), 0)
    const totalCollected = studentStatuses.reduce((acc, s) => Number(acc) + (parseFloat(s.totalPaid.toString()) || 0), 0)

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Fees - {monthName}</h1>
                <AddPaymentDialog students={studentStatuses} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalCollected}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">₹{totalPending}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                {studentStatuses.map((student) => (
                    <Card key={student.id} className="flex items-center justify-between p-4">
                        <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Banknote className="h-3 w-3" />
                                <span>Fee: ₹{student.monthlyFee}</span>
                                {student.remaining > 0 && (
                                    <span className="text-red-500 font-medium">
                                        (Pending: ₹{student.remaining})
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <Badge
                                variant={
                                    student.status === "PAID" ? "default" :
                                        student.status === "PARTIAL" ? "secondary" : "destructive"
                                }
                                className={
                                    student.status === "PAID" ? "bg-green-600 hover:bg-green-700" :
                                        student.status === "PARTIAL" ? "bg-yellow-500 hover:bg-yellow-600" :
                                            "bg-red-500 hover:bg-red-600"
                                }
                            >
                                {student.status}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
