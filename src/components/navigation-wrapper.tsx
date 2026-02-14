
"use client"

import { usePathname } from "next/navigation"
import { SideNav } from "./side-nav"
import { BottomNav } from "./bottom-nav"
import { MobileHeader } from "./mobile-header"
import { cn } from "@/lib/utils"

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup"

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            {!isPublicPage && <SideNav />}
            <div className={cn(
                "flex flex-col w-full",
                !isPublicPage && "pb-20 md:pb-0"
            )}>
                {!isPublicPage && <MobileHeader />}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
            {!isPublicPage && <BottomNav />}
        </div>
    )
}
