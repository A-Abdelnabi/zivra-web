export type InteractionType = 'whatsapp_click' | 'call_click' | 'menu_view' | 'consent_accept';

export async function logRestaurantInteraction(tenantId: string, type: InteractionType) {
    // In production, this would be a POST to /api/restaurant/analytics
    console.log(`[Restaurant Analytics] Tenant: ${tenantId}, Event: ${type}, Time: ${new Date().toISOString()}`);

    // Track via general analytics too if available
    try {
        const { trackEvent } = await import('@/lib/analytics');
        trackEvent(`restaurant_${type}` as any, { tenantId });
    } catch (e) {
        // Analytics not initialized or missing
    }
}
