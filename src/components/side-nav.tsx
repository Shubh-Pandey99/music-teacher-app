
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CalendarCheck, Banknote, BarChart3, Music } from "lucide-react"
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

export function SideNav() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72 h-screen sticky top-0">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Music className="h-6 w-6" />
                        <span className="">Music Teacher App</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        isActive
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}
