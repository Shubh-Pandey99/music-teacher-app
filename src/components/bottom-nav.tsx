
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
    },
    {
        name: "Attendance",
        href: "/attendance",
        icon: CalendarCheck,
    },
    {
        name: "Students",
        href: "/students",
        icon: Users,
    },
    {
        name: "Fees",
        href: "/fees",
        icon: Banknote,
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe pt-2 md:hidden">
            <nav className="flex justify-around items-center h-16 w-full">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 text-[10px] font-medium transition-all duration-300 relative",
                                isActive
                                    ? "text-primary scale-110"
                                    : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-full transition-all duration-300",
                                isActive ? "bg-primary/10 shadow-inner" : ""
                            )}>
                                <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                            </div>
                            <span className={cn(isActive && "font-bold")}>{item.name}</span>
                            {isActive && (
                                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                            )}
                        </Link>
                    )
                })}
                <LogoutButton>
                    <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[10px] font-medium text-muted-foreground transition-all duration-300 hover:text-destructive">
                        <div className="p-1 rounded-full">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <span>Logout</span>
                    </button>
                </LogoutButton>
            </nav>
        </div>
    )
}
