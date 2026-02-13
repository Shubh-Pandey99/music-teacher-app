"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteStudent } from "@/lib/actions/student"
import { toast } from "sonner"

export function DeleteStudentButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this student? All attendance and payment records will be lost.")) {
            return
        }

        startTransition(async () => {
            const result = await deleteStudent(id)
            if (result.success) {
                toast.success("Student deleted successfully")
                router.push("/students")
            } else {
                toast.error(result.error || "Failed to delete student")
            }
        })
    }

    return (
        <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            {isPending ? "Deleting..." : "Delete Student"}
        </Button>
    )
}
