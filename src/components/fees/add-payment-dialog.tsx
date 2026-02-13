
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
        if (selectedInfo && Number(amount) > selectedInfo.remaining) {
            alert(`Amount cannot exceed remaining balance of ₹${selectedInfo.remaining}`)
            return
        }
        startTransition(async () => {
            const formData = new FormData()
            formData.append("studentId", selectedStudent)
            formData.append("amount", amount)
            formData.append("monthPaidFor", `${month}-01`)
            formData.append("notes", notes)

            await addPayment(formData)
            setOpen(false)
            // Reset form?
            setAmount("")
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
                            max={selectedInfo?.remaining}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Payment"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
