import GrowthDashboard from "@/components/admin/GrowthDashboard";

export default async function GrowthPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return <GrowthDashboard locale={locale as any} />;
}
