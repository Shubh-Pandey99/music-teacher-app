
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/bottom-nav";
import { SideNav } from "@/components/side-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music Teacher App",
  description: "Attendance and Fee Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background")}>
        <div className="flex min-h-screen w-full flex-col md:flex-row">
          <SideNav />
          <div className="flex flex-col w-full md:pl-0 pb-20 md:pb-0">
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
