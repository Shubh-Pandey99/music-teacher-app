
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Trash2, Loader2, History, ArrowUpRight } from "lucide-react"
import { deletePayment } from "@/lib/actions/fees"
import { toast } from "sonner"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Payment {
    id: string; student: { name: string }; amount: number
    monthPaidFor: Date; date: Date; notes: string | null
}

export function PaymentHistory({ payments }: { payments: Payment[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        try {
            const result = await deletePayment(id)
            if (result.success) toast.success("Payment deleted")
            else toast.error(result.error || "Failed")
        } catch { toast.error("An error occurred") }
        finally { setDeletingId(null) }
    }

    if (payments.length === 0) return null

    return (
        <div className="rounded-2xl overflow-hidden border border-border bg-card animate-float-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-lg">
                        <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Recent Transactions</h3>
                        <p className="text-[10px] text-muted-foreground/60">{payments.length} records</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                    Live
                </span>
            </div>

            <div className="divide-y divide-border/40 max-h-[440px] overflow-y-auto">
                {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center gap-3 p-3.5 hover:bg-muted/30 transition-colors group">
                        <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, oklch(0.52 0.18 160), oklch(0.44 0.20 185))' }}
                        >
                            {payment.student.name[0]}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{payment.student.name}</p>
                            <p className="text-[11px] text-muted-foreground/70">{format(new Date(payment.monthPaidFor), "MMM yyyy")}</p>
                            <p className="text-[10px] text-muted-foreground/50">{format(new Date(payment.date), "dd MMM, h:mm a")}</p>
                            {payment.notes && (
                                <p className="text-[10px] text-muted-foreground/40 italic mt-0.5 truncate">&ldquo;{payment.notes}&rdquo;</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-0.5">
                                <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                    ₹{Number(payment.amount).toLocaleString()}
                                </span>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        disabled={deletingId === payment.id}
                                    >
                                        {deletingId === payment.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete payment?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove ₹{payment.amount} paid by <strong>{payment.student.name}</strong>. This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(payment.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
