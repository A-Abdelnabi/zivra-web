import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    // Redirect to the localized version
    const redirectUrl = new URL('/en/demo/restaurant', url.origin);
    return NextResponse.redirect(redirectUrl);
}
