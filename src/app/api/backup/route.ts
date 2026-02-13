import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

    // Fetch all teacher data for backup
    const backupData = await prisma.teacher.findUnique({
        where: { id: session.user.id },
        include: {
            students: {
                include: {
                    schedules: true,
                    attendance: true,
                    payments: true
                }
            }
        }
    })

    if (!backupData) {
        return new Response("No data found", { status: 404 })
    }

    const json = JSON.stringify(backupData, null, 2)

    return new Response(json, {
        headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="backup-${new Date().toISOString()}.json"`,
        },
    })
}
