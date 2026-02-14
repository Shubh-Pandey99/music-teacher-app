
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const protectedRoutes = ['/dashboard', '/attendance', '/students', '/fees', '/reports']
            const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))
            const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup')
            const isRootPage = nextUrl.pathname === '/'

            if (isProtectedRoute) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            if ((isAuthRoute || isRootPage) && isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl))
            }

            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
    },
    providers: [], // Add providers with dynamic overrides in auth.ts
} satisfies NextAuthConfig
