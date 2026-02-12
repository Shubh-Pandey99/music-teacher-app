
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Phone, Calendar } from "lucide-react"
import { getStudents } from "@/lib/actions/student"

export async function StudentList({ query, sort }: { query?: string; sort?: string }) {
    const students = await getStudents(query, sort)

    if (students.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No students found.</p>
                <Button asChild variant="link" className="mt-2">
                    <Link href="/students/new">Add your first student</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student: any) => {
                // Parse schedule for display
                const schedule = JSON.parse(student.scheduleDays as string) as string[]

                return (
                    <Link href={`/students/${student.id}`} key={student.id}>
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
                            <CardContent className="pb-2 text-sm space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{student.phone || "No phone"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>{schedule.join(", ")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
