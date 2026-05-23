
"use client"

import { Input } from "@/components/ui/input"
import { Search, Plus, ListFilter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function StudentListHeader() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("q", term)
        } else {
            params.delete("q")
        }
        startTransition(() => {
            router.replace(`/students?${params.toString()}`)
        })
    }

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("sort", sort)
        startTransition(() => {
            router.replace(`/students?${params.toString()}`)
        })
    }

    return (
        <div className="flex items-center gap-2.5 mb-5">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                    placeholder="Search students..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm font-medium placeholder:text-muted-foreground/40 outline-none transition-all duration-200 input-premium"
                    defaultValue={searchParams.get("q")?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Sort */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 text-muted-foreground hover:text-foreground"
                        style={{
                            background: 'oklch(0.16 0.03 280)',
                            border: '1px solid oklch(0.25 0.04 280)'
                        }}
                    >
                        <ListFilter className="h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    style={{
                        background: 'oklch(0.15 0.03 280)',
                        border: '1px solid oklch(0.25 0.04 280)'
                    }}
                >
                    <DropdownMenuRadioGroup value={searchParams.get("sort") || "name"} onValueChange={handleSort}>
                        <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="recent">Recent Activity</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Student */}
            <Link href="/students/new">
                <button
                    className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-bold text-white transition-all duration-200 btn-premium"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.52 0.25 270) 100%)',
                        boxShadow: '0 4px 16px rgba(139,92,246,0.3)'
                    }}
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Student</span>
                </button>
            </Link>
        </div>
    )
}
