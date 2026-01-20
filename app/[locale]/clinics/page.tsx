import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function ClinicsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    return (
        <VerticalPage
            locale={locale}
            vertical="clinics"
            dictOverrides={{
                heroTitle: locale === 'ar' ? "أتمتة حجز المواعيد لـ <span>العيادات والمراكز الطبية</span>" : "Appointment Automation for <span>Clinics & Medical Centers</span>",
                heroSubtitle: locale === 'ar' ? "مساعد ذكي ينسق مواعيد مرضاك ويرسل التنبيهات." : "Smart assistant coordinates patient appointments and sends reminders.",
                heroDescription: locale === 'ar' ? "قلل نسبة التخلف عن المواعيد وزيد كفاءة عيادتك بأتمتة كاملة لاستقبال المرضى." : "Reduce no-shows and increase clinic efficiency with full patient intake automation."
            }}
        />
    );
}
