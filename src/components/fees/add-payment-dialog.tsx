
"use client"

import { useState, useTransition } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addPayment } from "@/lib/actions/fees"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"

export function AddPaymentDialog({ students }: { students: { id: string; name: string; monthlyFee: number; remaining: number }[] }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const [selectedStudent, setSelectedStudent] = useState("")
    const [amount, setAmount] = useState("")
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
    const [notes, setNotes] = useState("")

    const selectedInfo = students.find(s => s.id === selectedStudent)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (Number(amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }
        startTransition(async () => {
            const formData = new FormData()
            formData.append("studentId", selectedStudent)
            formData.append("amount", amount)
            formData.append("monthPaidFor", `${month}-01`)
            formData.append("notes", notes)

            const result = await addPayment(formData)
            if (result.success) {
                toast.success("Payment recorded! 💰")
                setOpen(false)
                setAmount("")
                setNotes("")
            } else {
                toast.error(result.error || "Failed to record payment")
            }
        })
    }

    const handleStudentChange = (val: string) => {
        setSelectedStudent(val)
        const s = students.find(s => s.id === val)
        if (s) {
            setAmount(s.monthlyFee.toString())
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 btn-premium"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.52 0.18 160) 0%, oklch(0.44 0.20 185) 100%)',
                        boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Add Payment
                </button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md rounded-2xl"
                style={{
                    background: 'oklch(0.14 0.03 280)',
                    border: '1px solid oklch(0.25 0.04 280)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-bold">Record Payment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Student */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-foreground/80">Student</Label>
                        <Select onValueChange={handleStudentChange} value={selectedStudent}>
                            <SelectTrigger className="h-11 rounded-xl input-premium">
                                <SelectValue placeholder="Select student..." />
                            </SelectTrigger>
                            <SelectContent
                                style={{
                                    background: 'oklch(0.16 0.03 280)',
                                    border: '1px solid oklch(0.28 0.04 280)'
                                }}
                            >
                                {students.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} — ₹{s.monthlyFee}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Month */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-foreground/80">For Month</Label>
                        <Input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                            className="h-11 rounded-xl input-premium"
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-foreground/80">Amount (₹)</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="h-11 rounded-xl input-premium"
                            placeholder="0"
                        />
                        {selectedInfo && selectedInfo.remaining <= 0 && (
                            <div
                                className="text-sm font-medium p-2.5 rounded-xl mt-1"
                                style={{
                                    background: 'oklch(0.16 0.04 160 / 0.5)',
                                    border: '1px solid oklch(0.30 0.08 160 / 0.4)',
                                    color: '#4ade80'
                                }}
                            >
                                ✓ Fees already paid for this cycle
                            </div>
                        )}
                        {selectedInfo && selectedInfo.remaining > 0 && (
                            <p className="text-[11px] font-medium mt-1" style={{ color: '#fbbf24' }}>
                                Pending balance: ₹{selectedInfo.remaining.toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-foreground/80">Notes <span className="text-muted-foreground/50 font-normal">(optional)</span></Label>
                        <Input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Cash, UPI, etc."
                            className="h-11 rounded-xl input-premium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || !selectedStudent}
                        className="w-full h-11 rounded-xl font-bold text-white transition-all duration-200 btn-premium flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(135deg, oklch(0.52 0.18 160) 0%, oklch(0.44 0.20 185) 100%)',
                            boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                        }}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            selectedInfo && selectedInfo.remaining <= 0 ? "Record Advance Payment" : "Save Payment"
                        )}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
