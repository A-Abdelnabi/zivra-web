"use client";

import { Check } from "lucide-react";
import { Locale, Dictionary } from '@/lib/i18n';
import { PRICING_DATA, formatPrice, formatSetup } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { Reveal, RevealList, RevealItem } from '@/components/motion/Reveal';

const WHATSAPP_LINK = "https://wa.me/358401604442";

function PlanCard({ plan, locale }: { plan: any; locale: Locale }) {
    const pricing = PRICING_DATA[plan.id as keyof typeof PRICING_DATA];

    const priceText = pricing ? formatPrice(pricing.monthlyUSD, locale, 'hasPlus' in pricing && pricing.hasPlus) : "";
    const setupText = pricing ? formatSetup(pricing.setupUSD, locale, 'hasPlus' in pricing && pricing.hasPlus) : "";

    const handleCTA = () => {
        if (plan.id === 'starter' || plan.id === 'growth') {
            window.open(WHATSAPP_LINK, '_blank');
        } else {
            // Enterprise or other: scroll to contact
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'mailto:hello@zivra.dev';
            }
        }
    };

    return (
        <RevealItem>
            <div
                className={[
                    "relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-500 h-full",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur",
                    plan.recommended ? "ring-1 ring-purple-500/60 shadow-[0_0_40px_rgba(139,92,246,0.1)]" : "",
                    "hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.01] active:scale-[0.99]"
                ].join(" ")}
            >
                {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-200 z-10">
                        {locale === 'ar' ? 'موصى به' : 'Recommended'}
                    </div>
                )}

                <div className={locale === 'ar' ? 'text-right' : ''}>
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{plan.tagline}</p>
                </div>

                <div className={`mt-5 ${locale === 'ar' ? 'text-right' : ''}`}>
                    <div className="text-2xl font-semibold text-white tracking-tight">{priceText}</div>
                    <div className="mt-1 text-sm text-white/70">{setupText}</div>
                </div>

                <ul className="mt-5 space-y-2 text-sm text-white/80">
                    {plan.bullets.map((b: string) => (
                        <li key={b} className="flex items-start gap-2">
                            <Check className={`mt-0.5 h-4 w-4 text-purple-300 shrink-0 ${locale === 'ar' ? 'order-2' : ''}`} />
                            <span className={locale === 'ar' ? 'text-right flex-1' : ''}>{b}</span>
                        </li>
                    ))}
                </ul>

                <motion.button
                    type="button"
                    onClick={handleCTA}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    className={[
                        "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all shadow-lg shadow-purple-500/10",
                        "bg-purple-500 text-white hover:bg-purple-500/90 hover:shadow-purple-500/20",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-0",
                    ].join(" ")}
                >
                    {plan.cta}
                </motion.button>
            </div>
        </RevealItem>
    );
}

export default function Pricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section id="packages" className="mx-auto w-full max-w-6xl px-4 py-16">
            <Reveal>
                <div className="text-center">
                    <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                        {dict.pricing.badge}
                    </div>

                    <h2 className="mt-4 text-3xl font-semibold text-white">
                        {dict.pricing.title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
                        {dict.pricing.subtitle}
                    </p>
                </div>
            </Reveal>

            <RevealList delay={0.2}>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {dict.pricing.plans.map((p: any) => (
                        <PlanCard key={p.name} plan={p} locale={locale} />
                    ))}
                </div>
            </RevealList>

            <Reveal delay={0.5}>
                <div className="mt-12 text-center">
                    <p className="text-xs text-white/40 italic">
                        {dict.pricing.disclaimer}
                    </p>
                </div>
            </Reveal>
        </section>
    );
}