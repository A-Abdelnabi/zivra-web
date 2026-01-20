export const PRICING_DATA = {
    starter: {
        monthlyUSD: 159,
        setupUSD: 649,
    },
    business: {
        monthlyUSD: 529,
        setupUSD: 1999,
        recommended: true,
    },
    scale: {
        monthlyUSD: 949,
        setupUSD: 3199,
        hasPlus: false,
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
