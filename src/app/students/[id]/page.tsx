
import { getStudent, deleteStudent } from "@/lib/actions/student"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ArrowLeft } from "lucide-react"

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const student = await getStudent(id)

    if (!student) {
        notFound()
    }

    const handleDelete = async () => {
        "use server"
        await deleteStudent(student.id)
        redirect("/students")
    }

    const schedule = student.schedules.map(s => s.day)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/students">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
                <Badge variant={student.isActive ? "default" : "secondary"} className="ml-2">
                    {student.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Parent Name:</span> {student.parentName || "N/A"}
                        </div>
                        <div>
                            <span className="font-medium">Phone:</span> {student.phone || "N/A"}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Class Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Monthly Fee:</span> ₹{student.monthlyFee}
                        </div>
                        <div>
                            <span className="font-medium">Schedule:</span> {schedule.join(", ")}
                        </div>
                        <div>
                            <span className="font-medium">Joined:</span> {student.joiningDate.toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-4">
                <Button asChild>
                    <Link href={`/students/${student.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Student
                    </Link>
                </Button>

                <form action={handleDelete}>
                    <Button variant="destructive" type="submit">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                    </Button>
                </form>
            </div>
        </div>
    )
}
