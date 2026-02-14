
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CalendarCheck, Banknote, BarChart3, GraduationCap } from "lucide-react"
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
                    <div className="flex items-center gap-2 font-semibold">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">TeacherPro Manager</span>
                    </div>
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
                                        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-primary/5 rounded-xl blur-lg -z-10" />
                                    )}
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
