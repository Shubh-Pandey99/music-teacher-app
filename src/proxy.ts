
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export default auth(async function proxy(req: NextRequest & { auth: unknown }) {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    const protectedRoutes = ['/dashboard', '/attendance', '/students', '/fees', '/reports']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
