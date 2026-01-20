import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function SARestaurantsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;

    // Forced Saudi Arabic experience for maximum conversion
    return (
        <VerticalPage
            locale={locale}
            vertical="restaurants"
            dictOverrides={{
                heroTitle: locale === 'ar' ? "حوّل طلبات مطعمك إلى <span>أرباح تلقائية</span>" : "Turn Restaurant Orders Into <span>Automatic Profits</span>",
                heroSubtitle: locale === 'ar' ? "نظام أتمتة الواتساب الأول في السعودية." : "The #1 WhatsApp automation for Saudi restaurants.",
                heroDescription: locale === 'ar' ? "استقبل الطلبات، اعرض المنيو، واحجز الطاولات بذكاء اصطناعي يعمل 24/7." : "Receive orders, show menus, and book tables with AI working 24/7."
            }}
        />
    );
}
