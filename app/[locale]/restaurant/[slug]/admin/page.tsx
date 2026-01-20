import { Locale } from "@/lib/restaurant/types";
import TenantAdmin from "@/components/restaurant/TenantAdmin";

export default async function AdminPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    return <TenantAdmin slug={slug} locale={locale} />;
}
