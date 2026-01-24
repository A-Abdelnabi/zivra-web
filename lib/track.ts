/**
 * GA4 Tracking Utility
 * Safe and non-blocking for client-side events.
 */

export type TrackingEvent =
    | 'chat_open'
    | 'business_selected'
    | 'service_selected'
    | 'contact_whatsapp_click'
    | 'contact_email_click'
    | 'book_demo_click'
    | 'contact_form_submit'
    | 'pricing_view'
    | 'pricing_cta_click'
    | 'lead_capture_submit'
    | 'lead_capture_view';

export interface EventParams {
    language?: string;
    business_type?: string;
    service_interest?: string;
    source?: string;
    page_url?: string;
    [key: string]: any;
}

export function track(event: TrackingEvent, params: EventParams = {}) {
    if (typeof window === 'undefined') return;

    // Add global metadata
    const metadata = {
        ...params,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[GA4] Event: ${event}`, metadata);
    }

    // GA4 gtag push
    if (typeof (window as any).gtag === 'function') {
        try {
            (window as any).gtag('event', event, metadata);
        } catch (err) {
            // Silent fail
        }
    }
}
