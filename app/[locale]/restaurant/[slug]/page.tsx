import { Locale } from "@/lib/restaurant/types";
import RestaurantPortal from "@/components/restaurant/RestaurantPortal";
import { MOCK_RESTAURANTS } from "@/lib/restaurant/data";

export async function generateStaticParams() {
    return Object.keys(MOCK_RESTAURANTS).map((slug) => ({ slug }));
}

export default async function RestaurantPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    return <RestaurantPortal slug={slug} locale={locale} />;
}
