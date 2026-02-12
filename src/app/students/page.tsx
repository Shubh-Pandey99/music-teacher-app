
import { StudentListHeader } from "@/components/students/student-list-header"
import { StudentList } from "@/components/students/student-list"
import { Suspense } from "react"

export default async function StudentsPage({ // Marked async to be safe, though component is async already
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string }>
}) {
    const { q, sort } = await searchParams
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
            <StudentListHeader />
            <Suspense fallback={<div className="p-4 text-center">Loading students...</div>}>
                <StudentList query={q} sort={sort} />
            </Suspense>
        </div>
    )
}
