import { RestaurantTenant } from "./types";

export const MOCK_RESTAURANTS: Record<string, RestaurantTenant> = {
    "cairodeli": {
        id: "tenant_1",
        slug: "cairodeli",
        name: {
            en: "CairoDeli",
            ar: "كايرو ديلي",
        },
        logoUrl: "/images/cairodeli/logo.png",
        phone: "+9665XXXXXXXX",
        whatsapp: "9665XXXXXXXX",
        currency: "SAR",
        settings: {
            aiEnabled: true,
            theme: "glass",
            privacyText: {
                en: "By continuing, you agree to our data collection for order processing and AI interaction under Saudi PDPL laws.",
                ar: "من خلال المتابعة، فإنك توافق على جمع بياناتنا لمعالجة الطلبات والتفاعل مع الذكاء الاصطناعي بموجب قوانين نظام حماية البيانات الشخصية السعودي.",
            },
            status: 'live'
        },
        menu: [
            {
                id: "m1",
                name: { en: "Classic Koshary", ar: "كشري كلاسيك" },
                description: { en: "Authentic Egyptian koshary with spicy tomato sauce.", ar: "كشري مصري أصيل مع صلصة طماطم حارة." },
                price: 25,
                category: "Main",
                available: true,
                image: "/images/cairodeli/koshary.jpg",
            },
            {
                id: "m2",
                name: { en: "Molokhia with Chicken", ar: "ملوخية بالدجاج" },
                description: { en: "Traditional molokhia served with roasted chicken.", ar: "ملوخية تقليدية تقدم مع دجاج محمر." },
                price: 45,
                category: "Main",
                available: true,
                image: "/images/cairodeli/molokhia.jpg",
            }
        ],
    },
};

export async function getTenantBySlug(slug: string): Promise<RestaurantTenant | null> {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 100));
    return MOCK_RESTAURANTS[slug] || null;
}
