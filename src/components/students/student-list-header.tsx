
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
    const [isPending, startTransition] = useTransition()

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
        <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search students..."
                    className="pl-8"
                    defaultValue={searchParams.get("q")?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <ListFilter className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={searchParams.get("sort") || "name"} onValueChange={handleSort}>
                        <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="recent">Recent Activity</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild size="icon">
                <Link href="/students/new">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Student</span>
                </Link>
            </Button>
        </div>
    )
}
