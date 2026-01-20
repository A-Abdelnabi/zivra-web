import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('[Stripe Webhook] Checkout Session Completed', session.id);
            // Here you would typically fulfill the order or update user status in DB
            break;
        case 'customer.subscription.deleted':
            console.log('[Stripe Webhook] Subscription Deleted');
            // Handle cancellation logic (soft lock, etc.)
            break;
        case 'invoice.payment_failed':
            console.log('[Stripe Webhook] Invoice Payment Failed');
            // Handle failed payment (7-day grace period logic)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
