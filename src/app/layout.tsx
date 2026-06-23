import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { NavigationWrapper } from "@/components/layout/navigation-wrapper"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "MusicPro Manager",
    description: "The all-in-one studio management platform for music teachers",
    keywords: ["music teacher", "student management", "attendance tracking", "fee management"],
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.variable, "antialiased min-h-screen bg-background font-sans")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange={false}
                >
                    <NavigationWrapper>
                        {children}
                    </NavigationWrapper>
                    <Toaster
                        richColors
                        position="top-right"
                        toastOptions={{
                            className: "rounded-xl border border-border text-sm font-medium",
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    )
}
