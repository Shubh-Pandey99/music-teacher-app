
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Phone, Calendar, MessageCircle, Users } from "lucide-react"
import { getStudents } from "@/lib/actions/student"
import { WhatsAppButton } from "./whatsapp-button"
import { cn } from "@/lib/utils"

interface Student {
    id: string
    name: string
    isActive: boolean
    parentName?: string | null
    phone?: string | null
    schedules: { day: string }[]
}

export async function StudentList({ query, sort }: { query?: string; sort?: string }) {
    const students = await getStudents(query, sort) as unknown as Student[]

    if (students.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No students found.</p>
                <Button asChild variant="link" className="mt-2">
                    <Link href="/students/new" prefetch={false}>Add your first student</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => {
                const scheduleDaysArr = student.schedules.map(s => s.day)

                return (
                    <Link href={`/students/${student.id}`} key={student.id} prefetch={false} className="group">
                        <Card className="premium-card transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-colored border-none relative overflow-hidden h-64 flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users className="h-40 w-40" />
                            </div>

                            <CardHeader className="pb-2 relative z-10 p-8">
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{student.name}</CardTitle>
                                    <Badge variant={student.isActive ? "default" : "secondary"} className={cn(
                                        "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none",
                                        student.isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {student.isActive ? "Elite Active" : "Paused"}
                                    </Badge>
                                </div>
                                <CardDescription className="text-sm font-bold text-slate-400 italic">
                                    {student.parentName ? `C/O ${student.parentName}` : "Direct Contact"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-8 px-8 relative z-10 space-y-4 mt-auto">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm">{student.phone || "No protocol"}</span>
                                    </div>
                                    {student.phone && (
                                        <WhatsAppButton phone={student.phone} />
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm tracking-tight">{scheduleDaysArr.join(" • ")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
