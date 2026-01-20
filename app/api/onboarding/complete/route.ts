import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        console.log('[Onboarding Completed]', data);

        // Simulated backend logic:
        // 1. Create client profile in DB
        // 2. Configure AI agent with businessType and mainService
        // 3. Trigger WhatsApp Welcome via Webhook

        const WELCOME_WEBHOOK = "https://n8n.zivra.dev/webhook/welcome-onboarding";

        // Non-blocking trigger
        fetch(WELCOME_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                message: data.locale === 'ar'
                    ? "أهلًا 👋 تم تفعيل ZIVRA عندك بنجاح. الشات شغال دلوقتي وجاهز يستقبل عملاءك 🚀"
                    : "Hello! ZIVRA is now active. Your AI chat is live and ready for customers 🚀"
            })
        }).catch(err => console.error('Onboarding Webhook failed', err));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
