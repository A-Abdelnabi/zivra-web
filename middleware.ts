import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    // Redirect root to default locale
    if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}`;
        return NextResponse.redirect(url);
    }

    // Redirect other paths to default locale
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, images, etc.)
        '/((?!api|_next/static|_next/image|images|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)',
    ],
};
