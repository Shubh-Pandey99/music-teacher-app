
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createStudent, updateStudent } from "@/lib/actions/student"
import { useTransition } from "react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    parentName: z.string().optional(),
    phone: z.string().optional(),
    monthlyFee: z.coerce.number().min(0),
    monthlyQuota: z.coerce.number().min(1).default(12),
    joiningDate: z.string().optional(),
    scheduleDays: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one day.",
    }),
})

const days = [
    { id: "MON", label: "Monday" },
    { id: "TUE", label: "Tuesday" },
    { id: "WED", label: "Wednesday" },
    { id: "THU", label: "Thursday" },
    { id: "FRI", label: "Friday" },
    { id: "SAT", label: "Saturday" },
    { id: "SUN", label: "Sunday" },
] as const

interface Student {
    id: string
    name: string
    parentName?: string | null
    phone?: string | null
    monthlyFee: number
    monthlyQuota: number
    joiningDate: Date
    schedules: { day: string }[]
}

interface StudentFormProps {
    student?: Student
    isEditing?: boolean
}

export function StudentForm({ student, isEditing = false }: StudentFormProps) {
    const [isPending, startTransition] = useTransition()

    const defaultValues: Partial<z.infer<typeof formSchema>> = student
        ? {
            name: student.name,
            parentName: student.parentName || "",
            phone: student.phone || "",
            monthlyFee: student.monthlyFee,
            monthlyQuota: student.monthlyQuota,
            joiningDate: student.joiningDate ? new Date(student.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            scheduleDays: student.schedules.map(s => s.day),
        }
        : {
            name: "",
            parentName: "",
            phone: "",
            monthlyFee: 0,
            monthlyQuota: 12,
            joiningDate: new Date().toISOString().split('T')[0],
            scheduleDays: [],
        }

    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues,
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", values.name)
            if (values.parentName) formData.append("parentName", values.parentName)
            if (values.phone) formData.append("phone", values.phone)
            formData.append("monthlyFee", values.monthlyFee.toString())
            formData.append("monthlyQuota", values.monthlyQuota.toString())
            if (values.joiningDate) formData.append("joiningDate", values.joiningDate)
            values.scheduleDays.forEach((day) => formData.append("scheduleDays", day))

            try {
                if (isEditing && student?.id) {
                    await updateStudent(student.id, formData)
                } else {
                    await createStudent(formData)
                }
            } catch (error) {
                console.error("Failed to save student:", error)
            }
        })
    }

    return (
        <Form {...form}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <form onSubmit={form.handleSubmit(onSubmit) as any} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+1 234 567 890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthlyFee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monthly Fee (₹)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthlyQuota"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monthly Class Limit</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                                Default is 12 classes per month.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="scheduleDays"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Schedule Days</FormLabel>
                                <FormDescription>
                                    Select the days the student attends class.
                                </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {days.map((day) => (
                                    <FormField
                                        key={day.id}
                                        control={form.control}
                                        name="scheduleDays"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={day.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(day.id)}
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            onCheckedChange={(checked: any) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, day.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value: string) => value !== day.id
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {day.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Saving..." : isEditing ? "Update Student" : "Add Student"}
                </Button>
            </form>
        </Form>
    )
}
