import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function SAPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    return (
        <VerticalPage
            locale={locale}
            vertical="general"
            dictOverrides={{
                heroTitle: locale === 'ar' ? "نمو أعمالك في <span>المملكة</span>" : "Scale Your Business in <span>Saudi</span>",
                heroSubtitle: locale === 'ar' ? "أتمتة ذكية مصممة للسوق السعودي." : "Smart automation designed for the KSA market.",
                heroDescription: locale === 'ar' ? "ساعد عملائك، احجز مواعيدك، وقم بإنهاء صفقاتك تلقائياً وبكل احترافية." : "Help your customers, book appointments, and close deals automatically and professionally."
            }}
        />
    );
}
