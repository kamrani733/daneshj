import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'session';

const protectedPaths = ['/dashboard', '/private-panel'];

/** Actor MS retrieve-for-visitor 500s when Accept-Language is a real locale. */
const actorProxyPrefixes = [
  '/api/profiles_base',
  '/api/profiles_user',
  '/api/profiles_individual',
  '/api/profiles_business',
  '/api/service_titles',
];

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

function isActorProxyPath(pathname: string) {
  return actorProxyPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (isActorProxyPath(pathname)) {
    const headers = new Headers(request.headers);
    headers.delete('accept-language');
    return NextResponse.next({ request: { headers } });
  }

  const authenticated = hasValidSession(request);

  if (authenticated && matchesPath(pathname, guestAuthPaths)) {
    const nextPath = searchParams.get('next');
    const redirectPath =
      nextPath?.startsWith('/') && !nextPath.startsWith('//')
        ? nextPath
        : '/public-panel';

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (matchesPath(pathname, protectedPaths) && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/api/profiles_base/:path*',
    '/api/profiles_user/:path*',
    '/api/profiles_individual/:path*',
    '/api/profiles_business/:path*',
    '/api/service_titles/:path*',
  ],
};
