import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'session';

const protectedPaths = ['/dashboard'];

/** Guest-only auth routes — logged-in users should not enter or start these flows. */
const guestAuthPaths = ['/login', '/forgot-password', '/register'];

function hasValidSession(request: NextRequest): boolean {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return false;

  try {
    const session = JSON.parse(atob(raw)) as {
      accessToken?: string | null;
    };
    return typeof session.accessToken === 'string' && session.accessToken.length > 0;
  } catch {
    return false;
  }
}

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasValidSession(request);

  if (authenticated && matchesPath(pathname, guestAuthPaths)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (matchesPath(pathname, protectedPaths) && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
