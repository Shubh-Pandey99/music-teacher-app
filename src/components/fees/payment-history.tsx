
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Trash2, Loader2, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { deletePayment } from "@/lib/actions/fees"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Payment {
    id: string
    student: { name: string }
    amount: number
    monthPaidFor: Date
    date: Date
    notes: string | null
}

export function PaymentHistory({ payments }: { payments: Payment[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        try {
            const result = await deletePayment(id)
            if (result.success) {
                toast.success("Payment deleted successfully")
            } else {
                toast.error(result.error || "Failed to delete payment")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setDeletingId(null)
        }
    }

    if (payments.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <History className="h-5 w-5" />
                    Recent Transactions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                            <div className="space-y-1">
                                <div className="font-medium">{payment.student.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    Paid for: {format(new Date(payment.monthPaidFor), "MMMM yyyy")}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Recorded on: {format(new Date(payment.date), "dd MMM, hh:mm a")}
                                </div>
                                {payment.notes && (
                                    <div className="text-xs italic text-muted-foreground mt-1">
                                        "{payment.notes}"
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="font-bold text-green-600 text-right">
                                    ₹{Number(payment.amount).toLocaleString()}
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-600 transition-colors"
                                            disabled={deletingId === payment.id}
                                        >
                                            {deletingId === payment.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the payment record for{" "}
                                                <span className="font-semibold">{payment.student.name}</span> of ₹
                                                {payment.amount}. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(payment.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
