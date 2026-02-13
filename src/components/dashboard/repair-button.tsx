
"use client"

import { Button } from "@/components/ui/button"
import { repairCorruptedData } from "@/lib/actions/student"
import { useTransition } from "react"
import { Hammer } from "lucide-react"

export function RepairDataButton() {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            size="lg"
            variant="ghost"
            className="h-20 flex flex-col gap-1 border border-dashed text-muted-foreground hover:text-primary"
            disabled={isPending}
            onClick={() => startTransition(async () => {
                const res = await repairCorruptedData()
                if (res.success) {
                    alert("Data repair completed! Corrupted fees have been reset.")
                }
            })}
        >
            <Hammer className="h-6 w-6" />
            {isPending ? "Repairing..." : "Repair Data"}
        </Button>
    )
}
