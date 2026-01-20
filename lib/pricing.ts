export const PRICING_DATA = {
    starter: {
        monthlyUSD: 149,
        setupUSD: 499,
    },
    growth: {
        monthlyUSD: 449,
        setupUSD: 1499,
        recommended: true,
    },
    enterprise: {
        monthlyUSD: 999, // Custom / Base
        setupUSD: 2999,
        hasPlus: true,
    },
} as const;

export function formatPrice(usdValue: number, locale: string, hasPlus = false) {
    const formattedNumber = usdValue.toLocaleString(locale === 'ar' ? 'en-US' : 'en-US'); // Keeping numbers Western style for USD usually
    if (locale === 'ar') {
        return `$${formattedNumber}${hasPlus ? '+' : ''} / شهرياً`;
    }
    return `$${formattedNumber}${hasPlus ? '+' : ''} / month`;
}

export function formatSetup(usdValue: number, locale: string, hasPlus = false) {
    const formattedNumber = usdValue.toLocaleString(locale === 'ar' ? 'en-US' : 'en-US');
    if (locale === 'ar') {
        return `+ $${formattedNumber}${hasPlus ? '+' : ''} رسوم تأسيس`;
    }
    return `+ $${formattedNumber}${hasPlus ? '+' : ''} setup fee`;
}
