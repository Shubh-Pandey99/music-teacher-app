
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
        <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 md:px-0">
            <div className="flex flex-col gap-2 animate-cinematic-in">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                    Directory
                </h1>
                <p className="text-slate-500 font-bold text-lg">Manage your elite roster of students and parents.</p>
            </div>

            <div className="animate-cinematic-in stagger-delay-1">
                <StudentListHeader />
            </div>

            <Suspense fallback={
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem]" />
                    ))}
                </div>
            }>
                <div className="animate-cinematic-in stagger-delay-2">
                    <StudentList query={q} sort={sort} />
                </div>
            </Suspense>
        </div>
    )
}
