
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { useTransition } from "react"
import { toast } from "sonner"

export function AddPaymentDialog({ students }: { students: { id: string; name: string; monthlyFee: number; remaining: number }[] }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Form states
    const [selectedStudent, setSelectedStudent] = useState("")
    const [amount, setAmount] = useState("")
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
    const [notes, setNotes] = useState("")

    const selectedInfo = students.find(s => s.id === selectedStudent)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // We support advance payments now, so we don't strictly block if amount > remaining.
        // But we still want a sanity check for very large amounts or negative ones.
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
                toast.success("Payment recorded successfully")
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
                <Button>Add Payment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="student">Student</Label>
                        <Select onValueChange={handleStudentChange} value={selectedStudent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} (₹{s.monthlyFee})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="month">For Month</Label>
                        <Input
                            id="month"
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                        {selectedInfo && selectedInfo.remaining <= 0 && (
                            <div className="text-sm font-medium text-green-600 bg-green-50 p-2 rounded-md border border-green-100 mt-1">
                                ✅ Fees already paid for this cycle.
                            </div>
                        )}
                        {selectedInfo && selectedInfo.remaining > 0 && (
                            <div className="text-sm text-yellow-600 font-medium">
                                Pending balance: ₹{selectedInfo.remaining.toLocaleString()}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Saving..." : (selectedInfo && selectedInfo.remaining <= 0 ? "Record Advance Payment" : "Save Payment")}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
