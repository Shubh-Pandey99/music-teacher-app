
import { getFeeStatus, getRecentPayments } from "@/lib/actions/fees"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddPaymentDialog } from "@/components/fees/add-payment-dialog"
import { PaymentHistory } from "@/components/fees/payment-history"
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

    const [studentStatuses, recentPayments] = await Promise.all([
        getFeeStatus(currentMonth, currentYear),
        getRecentPayments(15)
    ])

    const monthName = format(new Date(currentYear, currentMonth, 1), "MMMM yyyy")

    const totalPending = studentStatuses.reduce((acc, s) => acc + Number(s.remaining), 0)
    const totalCollected = studentStatuses.reduce((acc, s) => acc + Number(s.paidThisMonth), 0)

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
                        <div className="text-2xl font-bold text-green-600">₹{Number(totalCollected).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">₹{Number(totalPending).toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2 px-1">
                        Student Status
                    </h2>
                    {studentStatuses.map((student) => (
                        <Card key={student.id} className="flex items-center justify-between p-4">
                            <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Banknote className="h-3 w-3" />
                                    <span>Fee: ₹{Number(student.monthlyFee).toLocaleString()}</span>
                                    {Number(student.remaining) > 0 && (
                                        <span className="text-red-500 font-medium">
                                            (Pending: ₹{Number(student.remaining).toLocaleString()})
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

                <div className="space-y-3">
                    <PaymentHistory payments={recentPayments} />
                </div>
            </div>
        </div>
    )
}
