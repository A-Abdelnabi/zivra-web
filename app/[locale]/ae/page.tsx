import VerticalPage from "@/components/layout/vertical-page";
import { Locale } from "@/lib/i18n";

export default async function AEPage({
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
                heroTitle: locale === 'ar' ? "مستقبل الأعمال في <span>الإمارات</span>" : "Business Future in <span>UAE</span>",
                heroSubtitle: locale === 'ar' ? "حلول أتمتة عالمية المستوى في دبي وأبوظبي." : "World-class automation solutions in Dubai & Abu Dhabi.",
                heroDescription: locale === 'ar' ? "سرعة، كفاءة، وأتمتة كاملة للشركات المتنامية في الإمارات." : "Speed, efficiency, and full automation for growing companies in the UAE."
            }}
        />
    );
}
