export type PlanDetails = {
    readonly monthlyEUR: number;
    readonly setupEUR: number;
    readonly recommended?: boolean;
    readonly hasPlus?: boolean;
};

export type PriceTier = {
    readonly starter: PlanDetails;
    readonly growth: PlanDetails;
    readonly pro: PlanDetails;
};

export type VerticalType = 'general' | 'restaurants' | 'clinics' | 'services';

export const PRICING_BASE: PriceTier = {
    starter: { monthlyEUR: 49, setupEUR: 0 },
    growth: { monthlyEUR: 99, setupEUR: 0, recommended: true },
    pro: { monthlyEUR: 199, setupEUR: 0, hasPlus: true },
};

export const VERTICAL_PRICING: Record<VerticalType, PriceTier> = {
    general: PRICING_BASE,
    restaurants: PRICING_BASE,
    clinics: {
        starter: { monthlyEUR: 69, setupEUR: 0 },
        growth: { monthlyEUR: 149, setupEUR: 0, recommended: true },
        pro: { monthlyEUR: 249, setupEUR: 0, hasPlus: true },
    },
    services: {
        starter: { monthlyEUR: 59, setupEUR: 0 },
        growth: { monthlyEUR: 119, setupEUR: 0, recommended: true },
        pro: { monthlyEUR: 219, setupEUR: 0, hasPlus: true },
    },
};

export const PRICING_DATA = PRICING_BASE; // Backward compatibility

export function getPricing(vertical: VerticalType = 'general'): PriceTier {
    return VERTICAL_PRICING[vertical] || PRICING_BASE;
}

export function formatPrice(eurValue: number, locale: string, hasPlus = false) {
    const formattedNumber = eurValue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-IE');
    if (locale === 'ar') {
        return `€${formattedNumber}${hasPlus ? '+' : ''} / شهرياً`;
    }
    return `€${formattedNumber}${hasPlus ? '+' : ''} / month`;
}

export function formatSetup(eurValue: number, locale: string, hasPlus = false) {
    if (eurValue === 0) return "";
    const formattedNumber = eurValue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-IE');
    if (locale === 'ar') {
        return `+ €${formattedNumber}${hasPlus ? '+' : ''} رسوم تأسيس`;
    }
    return `+ €${formattedNumber}${hasPlus ? '+' : ''} setup fee`;
}
