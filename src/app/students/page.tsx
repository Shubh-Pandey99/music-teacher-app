
import { StudentListHeader } from "@/components/students/student-list-header"
import { StudentList } from "@/components/students/student-list"
import { Suspense } from "react"
import { Users } from "lucide-react"

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string }>
}) {
    const { q, sort } = await searchParams
    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col gap-1 animate-float-up">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-xl"
                        style={{ background: 'linear-gradient(135deg, oklch(0.50 0.20 220), oklch(0.44 0.22 240))' }}
                    >
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        Students
                    </h1>
                </div>
                <p className="text-muted-foreground font-medium pl-12">Manage your studio roster</p>
            </div>

            <Suspense fallback={null}>
                <StudentListHeader />
            </Suspense>

            <Suspense fallback={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl p-5 animate-pulse bg-card border border-border"
                            style={{ height: '140px' }}
                        />
                    ))}
                </div>
            }>
                <StudentList query={q} sort={sort} />
            </Suspense>
        </div>
    )
}
