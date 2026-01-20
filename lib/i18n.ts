// i18n helpers for both client and server

export type Locale = 'en' | 'ar';

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';

export type Dictionary = typeof import('@/messages/en.json');

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import('@/messages/en.json').then((module) => module.default),
    ar: () => import('@/messages/ar.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
    if (!locales.includes(locale)) {
        return dictionaries[defaultLocale]();
    }
    return dictionaries[locale]();
}

export function isRTL(locale: Locale): boolean {
    return locale === 'ar';
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
    return isRTL(locale) ? 'rtl' : 'ltr';
}
