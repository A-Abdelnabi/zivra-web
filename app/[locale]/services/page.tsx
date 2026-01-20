import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    return (
        <VerticalPage
            locale={locale}
            vertical="services"
            dictOverrides={{
                heroTitle: locale === 'ar' ? "حوّل استفساراتك لصفقات <span>لشركات الخدمات</span>" : "Turn Inquiries Into Deals for <span>Service Businesses</span>",
                heroSubtitle: locale === 'ar' ? "أتمتة جمع البيانات وفرز العملاء وتوجيههم." : "Automated lead capture, qualification, and routing.",
                heroDescription: locale === 'ar' ? "ريح فريق المبيعات وخل الذكاء الاصطناعي يجهز لك البيعة ويطلع لك البيانات المهمة." : "Relieve your sales team and let AI prepare the deal and extract critical data for you."
            }}
        />
    );
}
