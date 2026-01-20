export const SAR_USD_RATE = 3.75;

export const PRICING_DATA = {
    starter: {
        monthlySAR: 399,
        setupSAR: 3500,
    },
    business: {
        monthlySAR: 1290,
        setupSAR: 8900,
        recommended: true,
    },
    scale: {
        monthlySAR: 2990,
        setupSAR: 18000,
        hasPlus: true,
    },
} as const;

export function formatPrice(sarValue: number, locale: string, hasPlus = false) {
    if (locale === 'ar') {
        return `${sarValue.toLocaleString('en-US')}${hasPlus ? '+' : ''} ريال / شهر`;
    }
    const usdValue = Math.round(sarValue / SAR_USD_RATE);
    return `$${usdValue.toLocaleString('en-US')}${hasPlus ? '+' : ''} / month`;
}

export function formatSetup(sarValue: number, locale: string, hasPlus = false) {
    if (locale === 'ar') {
        return `+ ${sarValue.toLocaleString('en-US')}${hasPlus ? '+' : ''} ريال إعداد`;
    }
    const usdValue = Math.round(sarValue / SAR_USD_RATE);
    return `+ $${usdValue.toLocaleString('en-US')}${hasPlus ? '+' : ''} setup`;
}
