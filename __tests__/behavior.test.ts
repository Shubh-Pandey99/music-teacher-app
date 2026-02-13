import { describe, it, expect, vi } from "vitest"
import { createStudent } from "../src/lib/actions/student"
import { prisma } from "../src/lib/prisma"

// Mock dependencies
vi.mock("../src/lib/prisma", () => ({
    prisma: {
        student: {
            create: vi.fn(),
        },
    },
}))

vi.mock("../src/lib/action-utils", () => ({
    getAuthorizedSession: vi.fn(() => Promise.resolve({ user: { id: "teacher-1" } })),
    dateUtils: {
        normalizeToUTC: vi.fn((d) => d),
    }
}))

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}))

describe("Student Behavior", () => {
    it("should successfully create a student with valid data", async () => {
        const formData = new FormData()
        formData.append("name", "New Student")
        formData.append("monthlyFee", "1000")
        formData.append("monthlyQuota", "12")
        formData.append("scheduleDays", "MON")
        formData.append("scheduleDays", "WED")

        const result = await createStudent(formData)

        expect(result.success).toBe(true)
        expect(prisma.student.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                name: "New Student",
                teacherId: "teacher-1",
            })
        }))
    })

    it("should fail to create a student with missing required fields", async () => {
        const formData = new FormData()
        // name is missing

        const result = await createStudent(formData)

        expect(result.success).toBe(false)
        expect(result.validationErrors).toBeDefined()
        expect(result.validationErrors?.name).toBeDefined()
    })
})
