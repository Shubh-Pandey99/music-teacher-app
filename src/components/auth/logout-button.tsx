
"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
    className?: string
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
    hideText?: boolean
}

export function LogoutButton({ className, variant = "ghost", hideText = false }: LogoutButtonProps) {
    return (
        <Button
            variant={variant}
            className={cn("flex items-center gap-3 w-full justify-start", className)}
            onClick={() => signOut({ callbackUrl: "/login" })}
        >
            <LogOut className="h-4 w-4" />
            {!hideText && <span>Logout</span>}
        </Button>
    )
}
