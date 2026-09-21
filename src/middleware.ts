import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.AUTH_SECRET || 'sajilo_khoj_super_secure_secret_jwt_key_2026_at_least_32_bytes_long';
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sajilo_session')?.value;

  let session: any = null;
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, key, { algorithms: ['HS256'] });
      session = payload;
    } catch {
      session = null;
    }
  }

  // 1. Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // 2. Technician dashboard protection
  if (pathname.startsWith('/dashboard/technician')) {
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== 'TECHNICIAN' && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }
  }

  // 3. Customer dashboard protection
  if (pathname.startsWith('/dashboard/customer')) {
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 4. Auth pages (login, register) when already logged in
  if ((pathname === '/login' || pathname === '/register') && session) {
    if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (session.role === 'TECHNICIAN') {
      return NextResponse.redirect(new URL('/dashboard/technician', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
};
