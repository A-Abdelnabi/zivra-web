import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { planId, locale } = await req.json();

        const prices: Record<string, string> = {
            'starter': process.env.STRIPE_PRICE_STARTER!,
            'growth': process.env.STRIPE_PRICE_GROWTH!,
            'pro': process.env.STRIPE_PRICE_PRO!,
        };

        const priceId = prices[planId];
        if (!priceId) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}`,
            locale: (locale === 'ar' ? 'ar' : 'en') as any,
            metadata: {
                planId,
                locale,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[Stripe Checkout Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
