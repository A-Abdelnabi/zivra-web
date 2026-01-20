import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function RestaurantsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    return (
        <VerticalPage
            locale={locale}
            vertical="restaurants"
            dictOverrides={{
                heroTitle: locale === 'ar' ? "أتمتة كاملة لـ <span>المطاعم والكافيهات</span>" : "Full Automation for <span>Restaurants & Cafés</span>",
                heroSubtitle: locale === 'ar' ? "استقبل طلباتك وحجوزاتك آلياً عبر الواتساب." : "Receive orders and bookings automatically via WhatsApp.",
                heroDescription: locale === 'ar' ? "لا تضيع أي طلب.. خل المساعد الذكي يرد على استفسارات المنيو والحجوزات 24/7." : "Don't lose a single order. Let the AI assistant handle menu inquiries and bookings 24/7."
            }}
        />
    );
}
