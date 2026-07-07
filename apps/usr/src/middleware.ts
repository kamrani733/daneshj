import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'session';

const protectedPaths = ['/dashboard'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !request.cookies.get(SESSION_COOKIE)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
