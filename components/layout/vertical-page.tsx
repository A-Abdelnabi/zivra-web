"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/visual/hero";
import { Trust } from "@/components/visual/trust";
import { Services } from "@/components/visual/services";
import Pricing from "@/components/visual/pricing";
import UseCases from "@/components/sections/use-cases";
import { getDictionary, Locale } from "@/lib/i18n";

export default async function VerticalPage({
    locale,
    vertical,
    dictOverrides
}: {
    locale: Locale;
    vertical: any;
    dictOverrides?: {
        heroTitle?: string;
        heroSubtitle?: string;
        heroDescription?: string;
    };
}) {
    const dict = await getDictionary(locale);

    // Simple override logic for vertical positioning
    const verticalDict = {
        ...dict,
        hero: {
            ...dict.hero,
            title: dictOverrides?.heroTitle || dict.hero.title,
            subtitle: dictOverrides?.heroSubtitle || dict.hero.subtitle,
            description: dictOverrides?.heroDescription || dict.hero.description,
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar locale={locale} dict={verticalDict} />
            <main className="flex-1">
                <Hero locale={locale} dict={verticalDict} />
                <Trust locale={locale} dict={verticalDict} />
                <Services locale={locale} dict={verticalDict} />
                <UseCases locale={locale} dict={verticalDict} />
                <Pricing locale={locale} dict={verticalDict} vertical={vertical} />
            </main>
            <Footer locale={locale} dict={verticalDict} />
        </div>
    );
}
