
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CalendarCheck, Banknote, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./auth/logout-button"

const navItems = [
    {
        name: "Dashboard",
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
            <nav className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary/80"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
                <div className="flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive">
                    <LogoutButton hideText className="h-full w-full flex-col p-0 gap-1 bg-transparent hover:bg-transparent" />
                    <span className="text-[10px]">Logout</span>
                </div>
            </nav>
        </div>
    )
}
