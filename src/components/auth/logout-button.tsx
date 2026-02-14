"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
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
}

export function LogoutButton({ className, variant = "ghost", hideText = false }: LogoutButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={variant}
                    className={cn("flex items-center gap-3 w-full justify-start", className)}
                >
                    <LogOut className="h-4 w-4" />
                    {!hideText && <span>Logout</span>}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will need to sign in again to access your student records and dashboard.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
