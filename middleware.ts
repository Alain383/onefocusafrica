import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isOnLoginPage = req.nextUrl.pathname === '/admin/login'

  // Allow access to login page
  if (isOnLoginPage) {
    // Redirect to dashboard if already logged in
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if (isOnAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}