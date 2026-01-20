import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { type, data } = await req.json();

        // In production, integration with Twilio/360dialog/n8n goes here
        console.log(`[WhatsApp API] Triggering ${type} notification...`);

        if (type === 'HOT_LEAD') {
            console.log(`   TO SALES: New signup from ${data.businessName} (${data.whatsapp}). Plan: ${data.selectedPlanId}. Mode: ${data.paymentMode}.`);
        } else if (type === 'WELCOME') {
            const lang = data.lang || 'ar';
            const msg = lang === 'ar'
                ? `مرحباً ${data.businessName} 👋 تم إنشاء حسابك في ZIVRA بنجاح! فريقنا بيتواصل معك خلال ساعة للبدء.`
                : `Hi ${data.businessName} 👋 Your ZIVRA account has been created! Our team will contact you within the hour to start.`;
            console.log(`   TO CLIENT (${data.whatsapp}): ${msg}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
