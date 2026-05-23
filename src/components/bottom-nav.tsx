
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CalendarCheck, Banknote, BarChart3, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./auth/logout-button"

const navItems = [
    {
        name: "Home",
        href: "/dashboard",
        icon: LayoutDashboard,
        activeColor: "text-violet-500 dark:text-violet-400",
        activeBg: "bg-violet-500/10",
    },
    {
        name: "Attend",
        href: "/attendance",
        icon: CalendarCheck,
        activeColor: "text-teal-600 dark:text-teal-400",
        activeBg: "bg-teal-500/10",
    },
    {
        name: "Students",
        href: "/students",
        icon: Users,
        activeColor: "text-blue-600 dark:text-blue-400",
        activeBg: "bg-blue-500/10",
    },
    {
        name: "Fees",
        href: "/fees",
        icon: Banknote,
        activeColor: "text-amber-600 dark:text-amber-400",
        activeBg: "bg-amber-500/10",
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        activeColor: "text-emerald-600 dark:text-emerald-400",
        activeBg: "bg-emerald-500/10",
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-border/70" />
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <nav className="relative flex items-center h-16 px-1 pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 relative transition-colors duration-200",
                                isActive ? item.activeColor : "text-muted-foreground/70 hover:text-foreground"
                            )}
                        >
                            {/* Active top bar */}
                            {isActive && (
                                <div className="absolute top-0 w-6 h-0.5 rounded-b-full bg-current" />
                            )}

                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-200",
                                isActive ? item.activeBg : "hover:bg-accent"
                            )}>
                                <item.icon className={cn(
                                    "h-[18px] w-[18px] transition-transform duration-200",
                                    isActive && "scale-110"
                                )} />
                            </div>

                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wide",
                                isActive ? "opacity-100" : "opacity-50"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}

                {/* Logout */}
                <LogoutButton>
                    <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 text-muted-foreground/70 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
                        <div className="p-1.5 rounded-xl hover:bg-red-500/10 transition-all">
                            <LogOut className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wide opacity-50">Out</span>
                    </button>
                </LogoutButton>
            </nav>
        </div>
    )
}
