
import { auth } from "@/auth"
import fs from "fs"
import path from "path"

export async function GET(req: Request) {
    const session = await auth()
    if (!session) return new Response("Unauthorized", { status: 401 })

    const dbPath = path.join(process.cwd(), "dev.db") // Adjust if different

    if (!fs.existsSync(dbPath)) {
        return new Response("Database not found", { status: 404 })
    }

    const stat = fs.statSync(dbPath)
    const fileStream = fs.createReadStream(dbPath)

    return new Response(fileStream as any, {
        headers: {
            "Content-Type": "application/x-sqlite3",
            "Content-Disposition": `attachment; filename="backup-${new Date().toISOString()}.db"`,
            "Content-Length": stat.size.toString(),
        },
    })
}
