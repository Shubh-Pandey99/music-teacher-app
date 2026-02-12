
import { StudentForm } from "@/components/students/student-form"

export default function NewStudentPage() {
    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold tracking-tight">Add New Student</h1>
            <div className="max-w-2xl">
                <StudentForm />
            </div>
        </div>
    )
}
