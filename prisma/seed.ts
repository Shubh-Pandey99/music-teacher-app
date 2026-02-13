
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const email = process.env.SEED_EMAIL || "teacher@music.com"
    const password = process.env.SEED_PASSWORD || Math.random().toString(36).slice(-12)
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("------------------------------------------")
    console.log(`Seeding user: ${email}`)
    if (!process.env.SEED_PASSWORD) {
        console.log(`Generated Password: ${password}`)
        console.log("IMPORTANT: Save this password or set SEED_PASSWORD in your .env")
    }
    console.log("------------------------------------------")

    const teacher = await prisma.teacher.upsert({
        where: { email },
        update: {
            password: hashedPassword
        },
        create: {
            id: "cjh5u8g5g0000z3j8e5u8g5g0", // Consistent valid CUID for testing
            email,
            name: "Music Teacher",
            password: hashedPassword,
        },
    })

    // Seed a few students
    const today = new Date()
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const dayName = days[today.getDay()]

    await prisma.student.upsert({
        where: { id: "cmljr34ns0000iyi155k32yxn_test" }, // Use a CUID-like string that passes .cuid()
        update: {},
        create: {
            id: "cmljr34ns0000iyi155k32yxn_test",
            name: "Test Student One",
            parentName: "Parent One",
            phone: "1234567890",
            monthlyFee: 1000,
            monthlyQuota: 12,
            joiningDate: new Date(),
            teacherId: teacher.id,
            isActive: true,
            schedules: {
                create: [
                    { day: dayName },
                    { day: "MON" }
                ]
            }
        }
    })

    console.log("Seeding complete.")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
