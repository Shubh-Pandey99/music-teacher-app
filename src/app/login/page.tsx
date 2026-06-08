
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, Music2, Calendar, Users, CreditCard, BarChart3, CheckCircle2 } from "lucide-react"

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
                toast.success("Welcome back! 🎵")
                router.push("/dashboard")
                router.refresh()
            }
        } catch {
            toast.error("An error occurred during login")
        } finally {
            setLoading(false)
        }
    }

    const features = [
        { icon: Calendar, text: "Seamless Attendance Tracking", color: "text-teal-500 dark:text-teal-400" },
        { icon: Users, text: "Centralized Student Management", color: "text-blue-500 dark:text-blue-400" },
        { icon: CreditCard, text: "Automated Fee Collection", color: "text-amber-500 dark:text-amber-400" },
        { icon: BarChart3, text: "Comprehensive Progress Reports", color: "text-emerald-500 dark:text-emerald-400" },
    ]

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side: Branding — dark in dark mode, slate gradient in light mode */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden p-12 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 dark:from-[oklch(0.08_0.02_280)] dark:via-[oklch(0.12_0.04_295)] dark:to-[oklch(0.10_0.03_260)]">
                {/* Animated orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full animate-pulse-glow pointer-events-none"
                    style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 295 / 0.15) 0%, transparent 70%)' }} />
                <div className="absolute bottom-[15%] left-[-10%] w-[350px] h-[350px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, oklch(0.50 0.18 200 / 0.10) 0%, transparent 70%)' }} />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />

                {/* Logo */}
                <div className="relative z-10 animate-float-up">
                    <div className="flex items-center gap-3 mb-16">
                        <div
                            className="p-3 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))',
                                boxShadow: '0 0 30px rgba(139,92,246,0.5)'
                            }}
                        >
                            <Music2 className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="font-black text-2xl tracking-tight text-white">MusicPro</span>
                            <span className="block text-[10px] text-white/50 uppercase tracking-widest font-medium">Manager Platform</span>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-md">
                        <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                            Amplify your{" "}
                            <span
                                className="inline-block"
                                style={{
                                    background: 'linear-gradient(135deg, oklch(0.80 0.20 295), oklch(0.75 0.22 275))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                studio
                            </span>
                        </h1>
                        <p className="text-white/70 text-lg leading-relaxed">
                            The all-in-one workstation for independent music teachers and academies to manage students, track progress, and grow their passion.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="relative z-10 space-y-8 animate-float-up stagger-3">
                    <div className="space-y-3">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-default bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <div className="p-1.5 rounded-lg bg-white/10">
                                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                                </div>
                                <span className="text-sm font-medium text-white/90">{feature.text}</span>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70 ml-auto" />
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm italic leading-relaxed">
                            &ldquo;MusicPro Manager helped me double my students while spending 70% less time on admin. Game-changer for any music educator.&rdquo;
                        </p>
                        <p className="text-white font-semibold text-sm mt-2">— Sarah Chen, Professional Instructor</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden bg-background">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] right-[-5%] w-64 h-64 rounded-full"
                        style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 295 / 0.05) 0%, transparent 70%)' }} />
                    <div className="absolute bottom-[20%] left-[-5%] w-48 h-48 rounded-full"
                        style={{ background: 'radial-gradient(circle, oklch(0.50 0.18 200 / 0.04) 0%, transparent 70%)' }} />
                </div>

                <div className="w-full max-w-sm space-y-8 relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex flex-col items-center text-center animate-float-up">
                        <div
                            className="p-3 rounded-2xl mb-4"
                            style={{
                                background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))',
                                boxShadow: '0 0 30px rgba(139,92,246,0.4)'
                            }}
                        >
                            <Music2 className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">MusicPro</h2>
                        <p className="text-muted-foreground mt-2 text-sm">Manage your studio with total control.</p>
                        <div className="flex gap-2 mt-4">
                            {['Attendance', 'Fees', 'Reports'].map((f) => (
                                <span
                                    key={f}
                                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/40"
                                >
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="space-y-1 animate-float-up stagger-1">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                        <p className="text-muted-foreground">Sign in to your studio workspace</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 animate-float-up stagger-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@studio.com"
                                    required
                                    className="h-12 rounded-xl input-premium"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold text-foreground/90">
                                        Password
                                    </Label>
                                    <span className="text-xs text-violet-500 font-medium cursor-default">
                                        Forgot password?
                                    </span>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="h-12 rounded-xl input-premium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden btn-premium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{
                                background: loading
                                    ? 'oklch(0.40 0.15 295)'
                                    : 'linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.52 0.25 270) 100%)',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(139,92,246,0.4)'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In →"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative animate-float-up stagger-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/40" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-3 text-muted-foreground/60 font-medium bg-background">
                                New here?
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground animate-float-up stagger-4">
                        Join thousands of music educators.{" "}
                        <Link href="/signup" className="text-violet-500 font-bold hover:text-violet-600 dark:hover:text-violet-300 transition-colors underline-offset-4 hover:underline">
                            Create free account
                        </Link>
                    </p>
                </div>

                <footer className="mt-auto pt-8 text-center text-xs text-muted-foreground/40">
                    &copy; 2026 MusicPro Manager. All rights reserved.
                </footer>
            </div>
        </div>
    )
}
