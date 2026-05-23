
"use client"

import { Music2 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function MobileHeader() {
    return (
        <header className="sticky top-0 z-40 md:hidden">
            {/* Glass backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/60" />
            {/* Subtle bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative flex h-14 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-700 p-1.5 rounded-xl dark:shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                        <Music2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-sm text-foreground tracking-tight">MusicPro</span>
                        <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest ml-1.5">Manager</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Music visualizer */}
                    <div className="flex items-end gap-0.5 h-5 opacity-50 dark:opacity-70">
                        <div className="music-bar" style={{ height: '40%' }} />
                        <div className="music-bar" style={{ height: '90%' }} />
                        <div className="music-bar" style={{ height: '60%' }} />
                        <div className="music-bar" style={{ height: '100%' }} />
                        <div className="music-bar" style={{ height: '50%' }} />
                    </div>

                    {/* Theme toggle in mobile header */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
