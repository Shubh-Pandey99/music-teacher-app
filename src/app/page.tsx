import { auth } from "@/auth"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Music, CheckCircle, Users, CreditCard } from "lucide-react"

export default async function Home() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-sm sticky top-0 z-50 bg-white/80">
        <Link className="flex items-center justify-center group" href="/">
          <Music className="h-7 w-7 text-primary mr-2 transition-transform group-hover:scale-110" />
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            MusicPro Manager
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8">
          {isLoggedIn ? (
            <Link className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2" href="/dashboard">
              Dashboard <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">Pro</span>
            </Link>
          ) : (
            <>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
                Login
              </Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="/signup">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  The All-in-One Platform for Music Teachers
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
                  Manage students, track attendance, and collect fees with ease. Focus on teaching, we&apos;ll handle the rest.
                </p>
              </div>
              <div className="space-x-4">
                {isLoggedIn ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-zinc-600 font-medium">Welcome back, {session?.user?.name || 'Teacher'}!</p>
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                        Enter Command Center
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/signup">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Get Started Free</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg">Sign In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Student Management</h3>
                <p className="text-zinc-500">Keep detailed records of all your students, their levels, and joining dates.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Smart Attendance</h3>
                <p className="text-zinc-500">Track monthly quotas and extra classes automatically. No more manual counting.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold">Fee Tracking</h3>
                <p className="text-zinc-500">Manage monthly payments in INR. Instant visibility into pending fees.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-zinc-500">© 2026 MusicPro Manager. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
