"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, DefaultValues, Resolver, SubmitHandler } from "react-hook-form"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createStudent, updateStudent } from "@/lib/actions/student"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    parentName: z.string().optional(),
    phone: z.string().optional(),
    monthlyFee: z.coerce.number().min(0),
    monthlyQuota: z.coerce.number().min(1).max(31, "Quota cannot exceed 31 days"),
    joiningDate: z.string().optional(),
    scheduleDays: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one day.",
    }),
})

type FormValues = z.infer<typeof formSchema>

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
    joiningDate: Date | string
    schedules: { day: string }[]
}

interface StudentFormProps {
    student?: Student
    isEditing?: boolean
}

export function StudentForm({ student, isEditing = false }: StudentFormProps) {
    const [isPending, startTransition] = useTransition()

    const defaultValues: DefaultValues<FormValues> = student
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

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
        defaultValues,
    })

    const router = useRouter()
    const [error, setError] = React.useState<string | null>(null)

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        startTransition(async () => {
            setError(null)
            const formData = new FormData()
            formData.append("name", values.name)
            if (values.parentName) formData.append("parentName", values.parentName)
            if (values.phone) formData.append("phone", values.phone)
            formData.append("monthlyFee", values.monthlyFee.toString())
            formData.append("monthlyQuota", (values.monthlyQuota ?? 12).toString())
            if (values.joiningDate) formData.append("joiningDate", values.joiningDate)
            values.scheduleDays.forEach((day) => formData.append("scheduleDays", day))

            const result = isEditing && student?.id
                ? await updateStudent(student.id, formData)
                : await createStudent(formData)

            if (result.success) {
                toast.success(isEditing ? "Student updated successfully" : "Student added successfully")
                router.push("/students")
            } else {
                if (result.validationErrors) {
                    Object.entries(result.validationErrors).forEach(([key, messages]) => {
                        form.setError(key as keyof FormValues, {
                            type: "server",
                            message: (messages as string[])[0]
                        })
                    })
                    toast.error("Please check the form for errors")
                } else if (result.error) {
                    setError(result.error)
                    toast.error(result.error)
                }
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="joiningDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Joining Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                                Billing cycles will start from this day each month.
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
                                                            onCheckedChange={(checked) => {
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
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Saving..." : isEditing ? "Update Student" : "Add Student"}
                </Button>
            </form>
        </Form>
    )
}

