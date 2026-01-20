/**
 * Simple GA4 Tracking Utility
 * Silent and non-blocking.
 */

export type TrackingEvent =
    | 'chat_open'
    | 'business_selected'
    | 'service_selected'
    | 'contact_whatsapp_click'
    | 'contact_email_click'
    | 'pricing_view'
    | 'pricing_cta_click'
    | 'lead_capture_submit'
    | 'lead_capture_view'
    | 'restaurant_whatsapp_click'
    | 'restaurant_call_click'
    | 'restaurant_menu_view'
    | 'restaurant_consent_accept'
    | 'signup_view'
    | 'signup_step_started'
    | 'signup_step_completed'
    | 'plan_selected'
    | 'payment_started'
    | 'payment_success'
    | 'trial_created';

export interface EventParams {
    language?: string;
    business_type?: string;
    service_type?: string;
    plan_id?: string;
    location?: string;
    [key: string]: any;
}

export function trackEvent(event: TrackingEvent, params: EventParams = {}) {
    if (typeof window === 'undefined') return;

    // Add global metadata
    const metadata = {
        ...params,
        url: window.location.href,
        timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] Event: ${event}`, metadata);
    }

    // GA4 dataLayer push
    if ((window as any).dataLayer) {
        try {
            (window as any).dataLayer.push({
                event: event,
                ...metadata
            });
        } catch (err) {
            // Silent fail
        }
    }
}
