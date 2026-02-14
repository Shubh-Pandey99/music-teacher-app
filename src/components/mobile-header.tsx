
"use client"

import { GraduationCap } from "lucide-react"

export function MobileHeader() {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 sticky top-0 z-40 md:hidden">
            <div className="flex items-center gap-2 font-semibold">
                <div className="bg-primary p-1 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 text-lg">
                    TeacherPro Manager
                </span>
            </div>
            {/* You could add a user avatar or notifications here later */}
        </header>
    )
}
