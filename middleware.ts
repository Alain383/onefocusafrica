import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only apply to admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  
  // Check for session token (NextAuth JWT)
  const token = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token')
  
  // If no token, redirect to login (outside admin structure)
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // Token exists, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
