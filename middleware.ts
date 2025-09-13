import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'admin'
    const pathname = req.nextUrl.pathname

    // Redirect non-admin users trying to access admin routes
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect admin users from user dashboard to admin dashboard
    if (pathname.startsWith('/dashboard') && isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ['/', '/products', '/category', '/product', '/auth']
        const isPublicRoute = publicRoutes.some(route => 
          req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
        )

        if (isPublicRoute) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/checkout/:path*',
    '/cart/:path*'
  ]
}
