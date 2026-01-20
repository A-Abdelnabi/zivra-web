export interface OutreachTemplate {
    ar: { subject?: string; body: string; cta: string };
    en: { subject?: string; body: string; cta: string };
}

export const WHATSAPP_OUTREACH: OutreachTemplate = {
    ar: {
        body: "مرحبًا 👋\nنحن من ZIVRA، نساعد المطاعم في زيادة الطلبات عبر واتساب بدون عمولات.\nهل تحب أرسل لك مثال سريع؟",
        cta: "نعم، ورّيني"
    },
    en: {
        body: "Hi 👋\nWe are from ZIVRA. We help restaurants increase orders via WhatsApp with zero commissions.\nWould you like to see a quick example?",
        cta: "Yes, show me"
    }
};

export const EMAIL_OUTREACH: OutreachTemplate = {
    ar: {
        subject: "زيادة طلبات مطعمك عبر واتساب 🚀",
        body: "أهلاً [اسم المطعم]،\n\nنحن في ZIVRA نساعد المطاعم السعودية على أتمتة الطلبات عبر الواتساب وتقليل التكاليف.\n\nهل تود رؤية ديمو سريع لمنصتنا؟",
        cta: "تواصل معنا"
    },
    en: {
        subject: "Increase your restaurant orders via WhatsApp 🚀",
        body: "Hi [Restaurant Name],\n\nAt ZIVRA, we help Saudi restaurants automate WhatsApp orders and reduce costs.\n\nWould you like to see a quick demo of our platform?",
        cta: "Contact Us"
    }
};

export const DEMO_RESPONSE: OutreachTemplate = {
    ar: {
        body: "رائع! هذا ديمو سريع للمساعد الذكي في مطعم 'كايرو ديلي':\n\nhttps://zivra.dev/ar/restaurant/cairodeli\n\nأيضاً، تقدر تواصل معي هنا لأي استفسار.",
        cta: "تواصل واتساب"
    },
    en: {
        body: "Great! Here is a quick demo of the AI assistant for 'CairoDeli':\n\nhttps://zivra.dev/en/restaurant/cairodeli\n\nYou can also reach out to me here for any questions.",
        cta: "Talk to us"
    }
};
