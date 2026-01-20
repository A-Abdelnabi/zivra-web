export const SAR_USD_RATE = 3.75;

export const PRICING_DATA = {
    starter: {
        monthlySAR: 599,
        setupSAR: 2500,
    },
    business: {
        monthlySAR: 1999,
        setupSAR: 7500,
        recommended: true,
    },
    scale: {
        monthlySAR: 3499,
        setupSAR: 12000,
        hasPlus: false, // User provided exact numbers, no plus mentioned for monthly
    },
} as const;

export function formatPrice(sarValue: number, locale: string, hasPlus = false) {
    const formattedNumber = sarValue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
    if (locale === 'ar') {
        return `${formattedNumber}${hasPlus ? '+' : ''} ريال / شهر`;
    }
    return `${formattedNumber}${hasPlus ? '+' : ''} SAR / month`;
}

export function formatSetup(sarValue: number, locale: string, hasPlus = false) {
    const formattedNumber = sarValue.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
    if (locale === 'ar') {
        return `+ ${formattedNumber}${hasPlus ? '+' : ''} ريال إعداد`;
    }
    return `+ ${formattedNumber}${hasPlus ? '+' : ''} SAR setup`;
}
