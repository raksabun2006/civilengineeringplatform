import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internal paths, static files, and APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If pathname already starts with /km or /en, allow through
  if (pathname.startsWith('/km') || pathname.startsWith('/en')) {
    return NextResponse.next();
  }

  // Determine language preference from cookie (default: 'km')
  const savedLang = request.cookies.get('engineerbiz_lang')?.value;
  const lang = savedLang === 'en' ? 'en' : 'km';

  // Root path '/' -> redirects to '/km/dashboard'
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${lang}/dashboard`, request.url));
  }

  // Redirect unprefixed routes (e.g. /dashboard -> /km/dashboard)
  return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
