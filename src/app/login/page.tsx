
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
            <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden animate-gradient-slow bg-gradient-to-br from-slate-950 via-primary/40 to-blue-900/50">
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[noise]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-breathe" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16 animate-cinematic-in">
                        <div className="bg-primary/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 premium-shadow">
                            <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            TeacherPro Manager
                        </span>
                    </div>

                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight animate-cinematic-in stagger-delay-1">
                            Elevate your <span className="text-white relative inline-block">professional<span className="absolute bottom-2 left-0 w-full h-1 bg-primary/50 -z-10 blur-sm"></span></span> teaching journey.
                        </h1>
                        <p className="text-slate-400 text-xl leading-relaxed animate-cinematic-in stagger-delay-2 max-w-md">
                            The ultimate workstation designed for elite educators to scale their student base and automate their studio.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 space-y-10 animate-cinematic-in stagger-delay-3">
                    <div className="grid grid-cols-1 gap-5">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:translate-x-2 hover:shadow-2xl hover:shadow-primary/20 group">
                                <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/40 transition-colors">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-base font-semibold text-slate-200">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-10 border-t border-white/10">
                        <blockquote className="space-y-4">
                            <p className="text-slate-300 text-lg italic leading-relaxed">
                                "TeacherPro Manager didn't just organize my business; it redefined how I present myself to parents. It's the standard."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 p-[1px]">
                                    <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold">SC</div>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Sarah Chen</p>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Professional Instructor</p>
                                </div>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[noise] opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] animate-breathe" />

                <div className="w-full max-w-md space-y-10 glass p-10 sm:p-12 rounded-[3.5rem] animate-cinematic-in stagger-delay-1 relative z-10 shadow-2xl">
                    <div className="lg:hidden flex flex-col items-center mb-6 text-center">
                        <div className="bg-primary p-4 rounded-3xl mb-6 btn-premium animate-breathe shadow-colored">
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter animate-cinematic-in">TeacherPro Manager</h2>
                        <p className="text-slate-500 mt-3 max-w-[300px] font-medium animate-cinematic-in stagger-delay-1 text-lg">Your studio, supercharged.</p>

                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {['Attendance', 'Fees', 'Analytics'].map((f) => (
                                <span key={f} className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="text-left space-y-3 lg:block hidden">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
                        <p className="text-slate-500 font-semibold text-lg">Secure access to your professional dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-5">
                            <div className="grid gap-3">
                                <Label htmlFor="email" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@studio.com"
                                    required
                                    className="h-14 border-slate-200 transition-all rounded-2xl input-premium text-lg px-6"
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Password</Label>
                                    <Link href="#" className="text-sm text-primary hover:text-blue-600 transition-colors font-bold underline underline-offset-4 decoration-primary/20">Recovery?</Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="h-14 border-slate-200 transition-all rounded-2xl input-premium text-lg px-6"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 rounded-2xl text-lg font-black bg-slate-900 hover:bg-black text-white btn-premium shadow-colored"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                    Accessing...
                                </>
                            ) : "Sign In to Studio"}
                        </Button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-300">
                            <span className="bg-white dark:bg-slate-900 px-4">New Professional?</span>
                        </div>
                    </div>

                    <p className="text-center text-base text-slate-500 font-medium">
                        Elevate your teaching.{" "}
                        <Link href="/signup" className="text-primary font-black hover:text-blue-600 transition-all decoration-2 underline underline-offset-8 decoration-primary/10 hover:decoration-primary">
                            Register Now
                        </Link>
                    </p>
                </div>

                <footer className="mt-auto pt-16 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    &copy; 2026 TeacherPro Manager &bull; Advanced Studio Workstation
                </footer>
            </div>
        </div>
    )
}
