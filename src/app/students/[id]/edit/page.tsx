
import { getStudent } from "@/lib/actions/student"
import { StudentForm } from "@/components/students/student-form"
import { notFound } from "next/navigation"

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const student = await getStudent(id)

    if (!student) {
        notFound()
    }

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
            <div className="max-w-2xl">
                <StudentForm student={student} isEditing />
            </div>
        </div>
    )
}
