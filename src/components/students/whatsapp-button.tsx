
"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppButton({ phone }: { phone: string }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 shrink-0"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://wa.me/91${phone.replace(/\D/g, '')}`, '_blank');
            }}
        >
            <MessageCircle className="h-4 w-4" />
        </Button>
    )
}
