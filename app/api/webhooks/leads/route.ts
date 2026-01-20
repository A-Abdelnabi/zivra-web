import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // This is a placeholder for actual lead processing 
        // (e.g., sending to Discord, Email, or a CRM)
        console.log('[Lead Captured]', data);

        // Forward to a primary webhook if configured
        const WEBHOOK_URL = "https://n8n.zivra.dev/webhook/lead-capture";

        // We do not await this to keep it non-blocking for the user
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Webhook failed', err));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
