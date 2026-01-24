import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, Locale } from '@/lib/i18n';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Skip if the path is an internal Next.js path or asset
    // (Though matcher handles most of this, we keep a second layer of safety)
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next();
    }

    // 2. Check if pathname already has a supported locale as the first segment
    const pathnameSegments = pathname.split('/');
    const firstSegment = pathnameSegments[1]; // segment [0] is empty because of leading slash
    const hasLocale = locales.includes(firstSegment as Locale);

    if (hasLocale) {
        return NextResponse.next();
    }

    // 3. Redirect to default locale if no locale is present
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;

    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Match all request paths except for the ones starting with:
        // - api (API routes)
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - images (public images)
        // - favicon.ico (favicon file)
        // - robots.txt, sitemap.xml
        '/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};
