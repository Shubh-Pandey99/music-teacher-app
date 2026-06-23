"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [animating, setAnimating] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="theme-toggle opacity-0" aria-hidden />

    const isDark = theme === "dark"

    function toggle() {
        setAnimating(true)
        setTheme(isDark ? "light" : "dark")
        setTimeout(() => setAnimating(false), 500)
    }

    return (
        <button
            onClick={toggle}
            className={`theme-toggle ${className ?? ""}`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
        >
            <span className={animating ? "animate-theme-flip" : ""}>
                {isDark
                    ? <Sun className="h-4 w-4" />
                    : <Moon className="h-4 w-4" />
                }
            </span>
        </button>
    )
}
