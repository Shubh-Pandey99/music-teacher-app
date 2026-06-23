
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CalendarCheck, Banknote, BarChart3, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "../auth/logout-button"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "from-violet-500 to-purple-600",
        glow: "rgba(139, 92, 246, 0.5)",
    },
    {
        name: "Attendance",
        href: "/attendance",
        icon: CalendarCheck,
        color: "from-teal-500 to-cyan-600",
        glow: "rgba(20, 184, 166, 0.5)",
    },
    {
        name: "Students",
        href: "/students",
        icon: Users,
        color: "from-blue-500 to-indigo-600",
        glow: "rgba(99, 102, 241, 0.5)",
    },
    {
        name: "Fees",
        href: "/fees",
        icon: Banknote,
        color: "from-amber-500 to-orange-600",
        glow: "rgba(245, 158, 11, 0.5)",
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        color: "from-emerald-500 to-green-600",
        glow: "rgba(16, 185, 129, 0.5)",
    },
]

export function SideNav() {
    const pathname = usePathname()

    return (
        <div className="sidebar-gradient hidden md:flex md:w-60 lg:w-64 h-screen sticky top-0 flex-col overflow-hidden z-30">

            {/* Decorative orbs — dark only */}
            <div className="dark:block hidden absolute top-[-60px] right-[-40px] w-[200px] h-[200px] rounded-full bg-violet-600/10 blur-[60px] pointer-events-none" />
            <div className="dark:block hidden absolute bottom-[100px] left-[-40px] w-[150px] h-[150px] rounded-full bg-cyan-500/8 blur-[50px] pointer-events-none" />

            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                        <div className="bg-gradient-to-br from-violet-500 to-purple-700 p-1.5 rounded-xl shadow-lg dark:shadow-violet-900/40">
                            <Music2 className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-sm text-foreground tracking-tight">MusicPro</span>
                        <span className="block text-[9px] text-muted-foreground/60 uppercase tracking-widest font-medium">Manager</span>
                    </div>
                </div>
                {/* Theme toggle in sidebar header */}
                <ThemeToggle />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 px-2.5 mb-2">Navigation</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200 relative",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                            style={isActive ? {
                                background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
                                border: '1px solid color-mix(in oklch, var(--primary) 25%, transparent)',
                            } : {}}
                        >
                            {/* Active left bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-primary opacity-80" />
                            )}

                            {/* Icon */}
                            <div className={cn(
                                "p-1.5 rounded-lg transition-all shrink-0",
                                isActive
                                    ? `bg-gradient-to-br ${item.color}`
                                    : "bg-accent/60 group-hover:bg-accent"
                            )}>
                                <item.icon className={cn(
                                    "h-3.5 w-3.5 transition-transform group-hover:scale-110",
                                    isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                            </div>

                            <span className={cn("text-sm", isActive && "font-semibold")}>
                                {item.name}
                            </span>

                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary opacity-80" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom: logout */}
            <div className="px-2.5 py-3 border-t border-border/60">
                <LogoutButton />
            </div>
        </div>
    )
}
