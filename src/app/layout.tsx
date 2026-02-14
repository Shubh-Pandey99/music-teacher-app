
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NavigationWrapper } from "@/components/navigation-wrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeacherPro Manager",
  description: "Attendance and Fee Management for Professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background")}>
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
