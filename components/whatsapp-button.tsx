"use client";

import { Locale } from '@/lib/i18n';
import { track } from '@/lib/track';

export default function WhatsAppButton({ locale }: { locale: Locale }) {
    const phoneNumber = "358401604442";

    const message = locale === 'ar'
        ? "مرحباً ZIVRA! أود الاستفسار عن بناء موقع، تطبيق، أو أتمتة بالذكاء الاصطناعي."
        : "Hi ZIVRA! I want to ask about building a website, app, or AI automation.";

    const encodedMessage = encodeURIComponent(message);
    const href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    const handleClick = () => {
        const leadData = {
            locale,
            page_url: window.location.href,
            source: 'sticky_whatsapp' as const,
            contact_method: 'whatsapp',
            user_agent: navigator.userAgent,
        };
        track('contact_whatsapp_click', leadData);
        fetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify(leadData)
        }).catch(() => { });
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            className="fixed bottom-5 right-20 z-[99999]"
        >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:opacity-95 transition-transform hover:scale-105">
                <span className="text-xl">📱</span>
            </div>
        </a>
    );
}