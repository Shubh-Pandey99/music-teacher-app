
"use client"

import { useState } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/actions/auth"
import { AlertCircle, Loader2, Music2, Zap, ShieldCheck, Rocket } from "lucide-react"
import { toast } from "sonner"

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
                toast.success("Account created! Welcome to MusicPro 🎵")
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
        { icon: Zap, text: "Quick Setup — online in under 3 minutes" },
        { icon: ShieldCheck, text: "Secure Data — encrypted & backed up" },
        { icon: Rocket, text: "Scalable — from solo teacher to academy" },
    ]

    return (
        <div className="flex min-h-screen w-full">
            {/* Left: Branding */}
            <div
                className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, oklch(0.08 0.02 280) 0%, oklch(0.14 0.06 300) 50%, oklch(0.10 0.03 260) 100%)',
                    borderRight: '1px solid oklch(0.22 0.03 280)'
                }}
            >
                {/* Animated orbs */}
                <div className="absolute top-[-10%] right-[-15%] w-[450px] h-[450px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 295 / 0.15) 0%, transparent 70%)' }} />
                <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, oklch(0.52 0.18 160 / 0.08) 0%, transparent 70%)' }} />

                {/* Logo */}
                <div className="relative z-10">
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
                            <span className="block text-[10px] text-muted-foreground/60 uppercase tracking-widest">Manager Platform</span>
                        </div>
                    </div>

                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-violet-300 mb-6"
                        style={{ background: 'oklch(0.18 0.05 295 / 0.5)', border: '1px solid oklch(0.35 0.12 295 / 0.4)' }}
                    >
                        ✨ New: Automated Progress Reports
                    </div>

                    <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-6">
                        Join the global community of{" "}
                        <span style={{
                            background: 'linear-gradient(135deg, oklch(0.80 0.20 295), oklch(0.75 0.22 275))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            pro
                        </span>{" "}
                        teachers.
                    </h1>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="p-2 rounded-xl" style={{ background: 'oklch(0.18 0.05 295 / 0.4)' }}>
                                    <b.icon className="h-4 w-4 text-violet-300" />
                                </div>
                                <span className="text-sm text-foreground/80">{b.text}</span>
                            </div>
                        ))}
                    </div>

                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: 'oklch(0.15 0.03 280 / 0.7)', border: '1px solid oklch(0.28 0.04 280 / 0.4)' }}
                    >
                        <div className="flex gap-1 mb-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500/40 to-purple-700/40 border border-violet-500/30 -ml-1 first:ml-0" />
                            ))}
                            <span className="ml-2 text-sm font-medium text-white/80 self-center">200+ this month</span>
                        </div>
                        <p className="text-muted-foreground text-sm italic">
                            &ldquo;Best tool for managing my students. The automated fee tracking alone saves hours.&rdquo;
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div
                className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative"
                style={{ background: 'oklch(0.10 0.02 280)' }}
            >
                {/* Bg decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] right-[5%] w-64 h-64 rounded-full"
                        style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 295 / 0.05) 0%, transparent 70%)' }} />
                </div>

                <div className="w-full max-w-md space-y-7 relative z-10">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center text-center animate-float-up mb-2">
                        <div
                            className="p-3 rounded-2xl mb-4"
                            style={{
                                background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))',
                                boxShadow: '0 0 25px rgba(139,92,246,0.4)'
                            }}
                        >
                            <Music2 className="h-7 w-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white">MusicPro Manager</h2>
                        <p className="text-muted-foreground mt-1 text-sm">The #1 choice for modern educators.</p>
                    </div>

                    <div className="animate-float-up stagger-1">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Create account</h2>
                        <p className="text-muted-foreground mt-1">Join thousands of music educators worldwide.</p>
                    </div>

                    {error && (
                        <div
                            className="flex items-center gap-3 p-4 rounded-xl animate-scale-in"
                            style={{ background: 'oklch(0.16 0.04 25 / 0.5)', border: '1px solid oklch(0.35 0.10 25 / 0.5)' }}
                        >
                            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4 animate-float-up stagger-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Your full name"
                                required
                                className="h-12 rounded-xl input-premium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@studio.com"
                                required
                                className="h-12 rounded-xl input-premium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Min. 8 characters"
                                required
                                className="h-12 rounded-xl input-premium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl font-bold text-white transition-all duration-300 btn-premium flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                            style={{
                                background: loading ? 'oklch(0.40 0.15 295)' : 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(139,92,246,0.4)'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : "Get Started Free →"}
                        </button>

                        <p className="text-[11px] text-center text-muted-foreground/60 px-4 leading-relaxed">
                            By signing up, you agree to our{" "}
                            <span className="text-violet-400 cursor-pointer hover:underline">Terms</span> and{" "}
                            <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>.
                        </p>
                    </form>

                    <div className="pt-4 border-t border-border/30 text-center animate-float-up stagger-3">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors hover:underline underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
