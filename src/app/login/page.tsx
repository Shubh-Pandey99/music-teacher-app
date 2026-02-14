
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, GraduationCap, CheckCircle2, Calendar, Users, CreditCard, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Invalid email or password")
            } else {
                toast.success("Welcome back!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            toast.error("An error occurred during login")
        } finally {
            setLoading(false)
        }
    }

    const features = [
        { icon: Calendar, text: "Seamless Attendance Tracking" },
        { icon: Users, text: "Centralized Student Management" },
        { icon: CreditCard, text: "Automated Fee Collection" },
        { icon: BarChart3, text: "Comprehensive Progress Reports" },
    ]

    return (
        <div className="flex min-h-screen w-full font-sans">
            {/* Left Side: Product Overview & Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-900/20 pointer-events-none" />
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="bg-primary p-2 rounded-xl">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">TeacherPro Manager</span>
                    </div>

                    <div className="space-y-6 max-w-md">
                        <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
                            Elevate your <span className="text-primary italic">professional</span> teaching journey.
                        </h1>
                        <p className="text-slate-400 text-lg">
                            The all-in-one workstation for independent teachers and academies to manage students, track progress, and grow their passion.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="grid grid-cols-1 gap-4">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <feature.icon className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium text-slate-200">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/10">
                        <blockquote className="space-y-2">
                            <p className="text-slate-300 text-sm italic italic">
                                "TeacherPro Manager helped me more than double my students while spending 70% less time on administration. It's a game-changer."
                            </p>
                            <footer className="text-white font-semibold text-sm">— Sarah Chen, Professional Instructor</footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24 bg-white dark:bg-slate-950">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden flex flex-col items-center mb-12">
                        <GraduationCap className="h-10 w-10 text-primary mb-2" />
                        <h2 className="text-2xl font-bold italic tracking-tight">TeacherPro Manager</h2>
                    </div>

                    <div className="text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
                        <p className="text-muted-foreground">Sign in to manage your studio</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@studio.com"
                                    required
                                    className="h-12 border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="h-12 border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground font-medium">New here?</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Join 2,000+ teachers and academies.{" "}
                        <Link href="/signup" className="text-primary font-bold hover:underline transition-colors decoration-2 underline-offset-4">
                            Create a free account
                        </Link>
                    </p>
                </div>

                <footer className="mt-auto pt-12 text-center text-xs text-slate-400">
                    &copy; 2026 TeacherPro Manager. All rights reserved.
                </footer>
            </div>
        </div>
    )
}
