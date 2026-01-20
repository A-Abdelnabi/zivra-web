export const PRICING_DATA = {
    starter: {
        monthlyEUR: 49,
        setupEUR: 0,
    },
    growth: {
        monthlyEUR: 99,
        setupEUR: 0,
        recommended: true,
    },
    pro: {
        monthlyEUR: 199,
        setupEUR: 0,
        hasPlus: true,
    },
} as const;

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
