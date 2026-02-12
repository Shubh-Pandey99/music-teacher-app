
import { z } from "zod"

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters long"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsed.error.format(), null, 2)
    )
    throw new Error("Invalid environment variables")
}

export const env = parsed.data
