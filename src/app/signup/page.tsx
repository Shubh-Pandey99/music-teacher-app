
"use client"

import { useState } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/actions/auth"
import { AlertCircle, Loader2, GraduationCap, Sparkles, CheckCircle2, Rocket, ShieldCheck, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setError(null)
        setLoading(true)

        try {
            const result = await signup(formData)

            if (result.success) {
                toast.success("Account created successfully! Please login.")
                router.push("/login?signup=success")
                return
            }

            setError(result.error)
            toast.error(result.error)
        } catch {
            setError("Unable to connect to signup service. Please try again.")
            toast.error("Unable to connect to signup service")
        } finally {
            setLoading(false)
        }
    }

    const benefits = [
        { icon: Zap, title: "Quick Setup", desc: "Get your studio online in under 3 minutes." },
        { icon: ShieldCheck, title: "Secure Data", desc: "Your student records are encrypted and backed up." },
        { icon: Rocket, title: "Scalable", desc: "Built to support solo teachers to large academies." },
    ]

    return (
        <div className="flex min-h-screen w-full font-sans overflow-x-hidden">
            {/* Left Side: Inspiration & Social Proof */}
            <div className="hidden lg:flex lg:w-5/12 bg-primary text-white p-12 flex-col justify-between relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-10 mix-blend-overlay grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="bg-white p-2 rounded-xl">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">TeacherPro Manager</span>
                    </div>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-white">
                            <Sparkles className="h-3 w-3" />
                            New: Automated Progress Reports
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-white">
                            Join the global community of <span className="text-yellow-300">pro</span> teachers.
                        </h1>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-6">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1 bg-white/20 p-2 rounded-lg">
                                    <benefit.icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-white text-lg">{benefit.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-slate-200" />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-white/90">Joined by 200+ teachers this month</span>
                        </div>
                        <p className="text-white/80 text-sm italic leading-relaxed">
                            "The best tool for managing my students. The automated fee tracking is worth every penny."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24 bg-slate-50 dark:bg-slate-950">
                <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                    <div className="bg-primary p-3 rounded-2xl mb-4 shadow-lg shadow-primary/20">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight">TeacherPro Manager</h2>
                    <p className="text-slate-500 mt-2">The #1 Choice for modern educators.</p>
                </div>

                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create your account</h2>
                        <p className="text-slate-500 font-medium">Start your 14-day free trial today.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50 text-red-900">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form action={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold ml-1">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    required
                                    className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold ml-1">Work Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@studio.com"
                                    required
                                    className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold ml-1">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    required
                                    className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : "Get Started Free"}
                        </Button>

                        <div className="text-[11px] text-center text-slate-400 px-6 leading-relaxed">
                            By signing up, you agree to our <span className="text-primary font-semibold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
                        </div>
                    </form>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already using TeacherPro Manager?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline transition-colors decoration-2 underline-offset-4">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-6 text-slate-300 grayscale opacity-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trusted by</span>
                    <GraduationCap className="h-5 w-5" />
                    <Sparkles className="h-5 w-5" />
                    <Rocket className="h-5 w-5" />
                </div>
            </div>
        </div>
    )
}
