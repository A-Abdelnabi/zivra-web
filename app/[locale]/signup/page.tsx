"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SignupFlow from "@/components/signup/SignupFlow";

function SignupContent({ locale }: { locale: string }) {
    const searchParams = useSearchParams();
    const config = {
        businessType: searchParams.get('businessType') || undefined,
        service: searchParams.get('service') || undefined,
        source: searchParams.get('source') || undefined
    };

    return <SignupFlow locale={locale as any} params={config} />;
}

export default function SignupPage({ params: { locale } }: { params: { locale: string } }) {
    return (
        <main className="min-h-screen bg-[#050505]">
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
                <SignupContent locale={locale} />
            </Suspense>
        </main>
    );
}
