export type PlanDetails = {
    readonly monthlyUSD: number;
    readonly setupUSD: number;
    readonly recommended?: boolean;
};

export type PriceTier = {
    readonly starter: PlanDetails;
};

export type VerticalType = 'general' | 'restaurants';

export const PRICING_DATA: PriceTier = {
    starter: { monthlyUSD: 49, setupUSD: 149, recommended: true },
};

export function getPricing(vertical: VerticalType = 'restaurants'): PriceTier {
    return PRICING_DATA;
}

export function formatPrice(usdValue: number, locale: string) {
    const formattedNumber = usdValue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
    if (locale === 'ar') {
        return `$${formattedNumber} / شهرياً`;
    }
    return `$${formattedNumber} / month`;
}

export function formatSetup(usdValue: number, locale: string) {
    if (usdValue === 0) return "";
    const formattedNumber = usdValue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
    if (locale === 'ar') {
        return `+ $${formattedNumber} رسوم تأسيس تدفع مرة واحدة`;
    }
    return `+ $${formattedNumber} one-time setup fee`;
}
