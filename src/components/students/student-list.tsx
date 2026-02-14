
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Phone, Calendar, MessageCircle } from "lucide-react"
import { getStudents } from "@/lib/actions/student"
import { WhatsAppButton } from "./whatsapp-button"

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => {
                const scheduleDaysArr = student.schedules.map(s => s.day)

                return (
                    <Link href={`/students/${student.id}`} key={student.id} prefetch={false}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base">{student.name}</CardTitle>
                                    <Badge variant={student.isActive ? "default" : "secondary"}>
                                        {student.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <CardDescription className="text-xs">
                                    {student.parentName && `Parent: ${student.parentName}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4 text-sm space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                        <Phone className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{student.phone || "No phone"}</span>
                                    </div>
                                    {student.phone && (
                                        <WhatsAppButton phone={student.phone} />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{scheduleDaysArr.join(", ")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
