
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
            <div className="hidden lg:flex lg:w-5/12 bg-primary text-white p-12 flex-col justify-between relative overflow-hidden animate-gradient-slow bg-gradient-to-br from-slate-950 via-primary to-blue-900/40">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-[0.05] mix-blend-overlay grayscale" />
                <div className="absolute inset-0 bg-[noise] opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] animate-breathe" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16 animate-cinematic-in">
                        <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                            <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white/90">TeacherPro Manager</span>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/80 animate-cinematic-in stagger-delay-1">
                            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                            Premium Beta Workstation
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tighter text-white animate-cinematic-in stagger-delay-2">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white italic">global community</span> of elite teachers.
                        </h1>
                    </div>
                </div>

                <div className="relative z-10 space-y-10 animate-cinematic-in stagger-delay-3">
                    <div className="space-y-6">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-5 group transition-all duration-300 hover:translate-x-2">
                                <div className="mt-1 bg-white/10 p-3 rounded-2xl border border-white/10 group-hover:bg-white/20 transition-colors">
                                    <benefit.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-white text-xl tracking-tight">{benefit.title}</h3>
                                    <p className="text-white/60 text-base font-medium leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Rocket className="h-12 w-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                                ))}
                            </div>
                            <span className="text-sm font-black uppercase tracking-[0.1em] text-white/60">Joined by 2,000+ professionals</span>
                        </div>
                        <p className="text-white/80 text-lg italic leading-relaxed font-medium">
                            "This workstation redefined my professional presence. The most premium tool I've used."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[noise] opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                <div className="lg:hidden flex flex-col items-center mb-12 text-center animate-cinematic-in">
                    <div className="bg-primary p-4 rounded-3xl mb-6 btn-premium animate-breathe shadow-colored">
                        <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter">TeacherPro Manager</h2>
                    <p className="text-slate-500 mt-3 font-semibold text-lg">The Elite Choice for Modern Educators.</p>
                </div>

                <div className="w-full max-w-md space-y-10 glass p-10 sm:p-12 rounded-[3.5rem] animate-cinematic-in stagger-delay-1 relative z-10 shadow-2xl">
                    <div className="text-center space-y-3">
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Create Account</h2>
                        <p className="text-slate-500 font-semibold text-lg italic">Experience the 14-day professional trial.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="rounded-3xl border-red-100 bg-red-50 text-red-900 animate-cinematic-in">
                            <AlertCircle className="h-5 w-5" />
                            <AlertDescription className="font-bold">{error}</AlertDescription>
                        </Alert>
                    )}

                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="grid gap-3">
                                <Label htmlFor="name" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    required
                                    className="h-14 border-slate-200 rounded-2xl input-premium px-6 text-lg"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@studio.com"
                                    required
                                    className="h-14 border-slate-200 rounded-2xl input-premium px-6 text-lg"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Secure Studio Access"
                                    required
                                    className="h-14 border-slate-200 rounded-2xl input-premium px-6 text-lg"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-15 rounded-2xl text-xl font-black bg-primary hover:bg-slate-900 text-white btn-premium mt-4 shadow-colored"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                    Provisioning...
                                </>
                            ) : "Initialize Workstation"}
                        </Button>

                        <div className="text-[11px] text-center text-slate-400 px-6 leading-relaxed font-bold uppercase tracking-wider">
                            By initializing, you agree to our <span className="text-primary hover:text-blue-600 transition-colors cursor-pointer underline underline-offset-4 decoration-primary/20">Legal Terms</span>.
                        </div>
                    </form>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-base text-slate-500 font-semibold">
                            Already elite?{" "}
                            <Link href="/login" className="text-primary font-black hover:text-blue-600 transition-all underline underline-offset-8 decoration-primary/10 hover:decoration-primary decoration-2">
                                Access Dashboard
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex items-center gap-10 text-slate-300 grayscale opacity-40 animate-cinematic-in stagger-delay-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Accredited by</span>
                    <GraduationCap className="h-6 w-6" />
                    <Sparkles className="h-6 w-6" />
                    <Rocket className="h-6 w-6" />
                </div>
            </div>
        </div>
    )
}
