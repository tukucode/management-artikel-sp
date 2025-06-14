import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  const isAuthRoute = pathname.startsWith('/auth')
  const isLandingRoute = pathname.startsWith('/landing')
  const isDashboardRoute = pathname.startsWith('/dashboard')

  if (!token && (isDashboardRoute || isLandingRoute)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && role) {
    if (['user'].includes(role.toLocaleLowerCase()) && isDashboardRoute) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    if (['admin'].includes(role.toLocaleLowerCase()) && isLandingRoute) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    if (!['admin', 'user'].includes(role.toLocaleLowerCase())) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    if (isAuthRoute) {
      const redirectPath = ['user'].includes(role.toLocaleLowerCase())
        ? '/landing/article' 
        : '/dashboard/article'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*', '/landing/:path*'],
}
