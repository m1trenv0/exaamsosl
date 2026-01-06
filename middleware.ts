import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'nodejs',
  matcher: ['/admin/dashboard/:path*'],
}

export async function middleware(request: NextRequest) {
  // Check for auth token in cookies
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token')

  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}
