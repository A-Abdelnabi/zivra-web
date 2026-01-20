import OnboardingSuccess from "@/components/onboarding/OnboardingSuccess";

export default async function SuccessPage({
    params,
    searchParams
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ mode?: string }>;
}) {
    const { locale } = await params;
    const { mode } = await searchParams;

    return <OnboardingSuccess locale={locale as any} mode={(mode as any) || 'later'} />;
}
