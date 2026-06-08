import { auth } from "@/auth"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Music2, CheckCircle, Users, CreditCard } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function Home() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2 cursor-default">
          <div
            className="p-1.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))' }}
          >
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
            MusicPro Manager
          </span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          {!isLoggedIn ? (
            <>
              <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/login">
                Login
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-xl" style={{ background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))' }}>
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <LogoutButton variant="ghost" className="text-sm font-medium w-auto h-auto p-0 hover:bg-transparent" />
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-16 md:py-28 lg:py-36 relative overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/10">
          {/* Decorative orbs */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-60"
            style={{ background: 'radial-gradient(circle, oklch(0.65 0.22 295 / 0.12) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] rounded-full pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(circle, oklch(0.55 0.18 200 / 0.10) 0%, transparent 70%)' }} />

          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/40">
                ✨ The all-in-one studio management platform
              </div>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                  The All-in-One Platform{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
                    for Music Teachers
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Manage students, track attendance, and collect fees with ease. Focus on teaching — we&apos;ll handle the rest.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                {isLoggedIn ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-muted-foreground font-medium">Welcome back, {session?.user?.name || 'Teacher'}!</p>
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}>
                        Open Dashboard →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/signup">
                      <Button size="lg" className="rounded-xl font-bold text-white px-8" style={{ background: 'linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.52 0.25 270))', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}>
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="rounded-xl px-8 border-border">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-16 md:py-24 bg-card border-t border-border">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-center text-2xl font-bold text-foreground mb-10">Everything you need to run your studio</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Users, title: "Student Management", desc: "Keep detailed records of all your students, their levels, and joining dates.", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
                { icon: CheckCircle, title: "Smart Attendance", desc: "Track monthly quotas and extra classes automatically. No more manual counting.", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
                { icon: CreditCard, title: "Fee Tracking", desc: "Manage monthly payments in INR. Instant visibility into pending fees.", color: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
              ].map((f) => (
                <div key={f.title} className={`flex flex-col items-center space-y-3 text-center p-6 rounded-2xl border border-border ${f.bg} transition-all hover:shadow-md`}>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${f.color} shadow-sm`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center sm:justify-between px-4 md:px-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">© 2026 MusicPro Manager. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <span className="text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">Terms of Service</span>
          <span className="text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">Privacy</span>
        </nav>
      </footer>
    </div>
  )
}
