export type Locale = 'ar' | 'en';

export interface MenuItem {
    id: string;
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    price: number; // In SAR
    image?: string;
    category: string;
    available: boolean;
}

export interface RestaurantTenant {
    id: string;
    slug: string;
    name: {
        en: string;
        ar: string;
    };
    logoUrl: string;
    phone: string;
    whatsapp: string;
    currency: string; // SAR
    settings: {
        aiEnabled: boolean;
        theme: 'light' | 'dark' | 'glass';
        privacyText: {
            en: string;
            ar: string;
        };
    };
    menu: MenuItem[];
}

export interface ConsentRecord {
    tenantId: string;
    timestamp: number;
    consentGiven: boolean;
}

export interface RestaurantAnalytics {
    whatsappClicks: number;
    callClicks: number;
    menuViews: number;
    consentAccepts: number;
}
