import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function EGPage({
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
                heroTitle: locale === 'ar' ? "حوّل مشروعك لماكينة مبيعات في <span>مصر</span>" : "Turn Your Business Into a Sales Machine in <span>Egypt</span>",
                heroSubtitle: locale === 'ar' ? "أتمتة ذكية تجيب لك عملاء وتخلص شغلك." : "Smart automation that brings you leads and finishes your work.",
                heroDescription: locale === 'ar' ? "أكبر حجم مبيعات بأقل مجهود من خلال أتمتة الواتساب والذكاء الاصطناعي." : "Maximum sales volume with minimum effort through WhatsApp automation and AI."
            }}
        />
    );
}
