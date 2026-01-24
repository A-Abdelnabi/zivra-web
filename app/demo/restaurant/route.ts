import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    // Redirect to the default localized version (en)
    // The middleware might handle this if this file didn't exist, but since it does:
    const redirectUrl = new URL('/en/demo/restaurant', url.origin);
    return NextResponse.redirect(redirectUrl);
}
