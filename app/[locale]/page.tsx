import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/visual/hero";
import { Trust } from "@/components/visual/trust";
import { Services } from "@/components/visual/services";
import { Automation } from "@/components/visual/automation";
import Pricing from "@/components/visual/pricing";
import SocialPricing from "@/components/visual/social-pricing";
import UseCases from "@/components/sections/use-cases";
import { ContactForm } from "@/components/forms/contact-form";
import { getDictionary, Locale } from "@/lib/i18n";

export default async function Home({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar locale={locale} dict={dict} />
            <main className="flex-1">
                <Hero locale={locale} dict={dict} />
                <Trust locale={locale} dict={dict} />
                <Services locale={locale} dict={dict} />
                <Automation locale={locale} dict={dict} />
                <UseCases locale={locale} dict={dict} />
                <Pricing locale={locale} dict={dict} />
                <SocialPricing locale={locale} dict={dict} />
                <ContactForm locale={locale} dict={dict} />
            </main>
            <Footer locale={locale} dict={dict} />
        </div>
    );
}
