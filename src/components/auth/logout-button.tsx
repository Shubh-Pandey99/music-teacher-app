
"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LogoutButtonProps {
    className?: string
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
    hideText?: boolean
    children?: React.ReactNode
}

export function LogoutButton({ className, variant = "ghost", hideText = false, children }: LogoutButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children ? children : (
                    <button
                        className={cn(
                            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-red-400 hover:bg-red-500/10",
                            className
                        )}
                    >
                        <div className="p-1 rounded-lg">
                            <LogOut className="h-4 w-4" />
                        </div>
                        {!hideText && <span>Sign Out</span>}
                    </button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Sign out?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        You will need to sign in again to access your student records and dashboard.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-border/40">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                        Sign Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
