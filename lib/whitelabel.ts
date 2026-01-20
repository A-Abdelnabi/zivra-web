/**
 * Phase F: White-Label Branding Engine
 */

export interface WhiteLabelConfig {
    brandName: string;
    logoUrl?: string;
    primaryColor?: string;
    whatsappNumber?: string;
    domain?: string;
}

const BRAND_CONFIGS: Record<string, WhiteLabelConfig> = {
    'zivra': {
        brandName: 'ZIVRA',
        logoUrl: '/images/zivra-logo.jpg',
        whatsappNumber: '358401604442',
    },
    // Example Partner:
    'agency-x': {
        brandName: 'Agency X Automation',
        logoUrl: '/images/partners/agency-x-logo.png',
        whatsappNumber: '9665XXXXXXXX',
        primaryColor: '#ef4444',
    }
};

export function getBranding(brandId: string = 'zivra'): WhiteLabelConfig {
    return BRAND_CONFIGS[brandId] || BRAND_CONFIGS['zivra'];
}

/**
 * Revenue Multipliers (Add-ons)
 */
export const ADDONS = [
    { id: 'extra_wa', name: 'Extra WhatsApp Number', priceEUR: 29 },
    { id: 'crm_sync', name: 'Advanced CRM Integration', priceEUR: 49 },
    { id: 'priority_support', name: '24/7 Priority Support', priceEUR: 99 },
];
