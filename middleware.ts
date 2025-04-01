import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminPassword = request.cookies.get('admin_password')?.value;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    // If no password cookie or incorrect password, redirect to admin login
    if (!adminPassword || adminPassword !== expectedPassword) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};