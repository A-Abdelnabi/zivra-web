"use client";

import * as React from "react";

import { Check } from "lucide-react";
import { Locale, Dictionary } from '@/lib/i18n';
import { getPricing, formatPrice, formatSetup, VerticalType } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { Reveal, RevealList, RevealItem } from '@/components/motion/Reveal';
import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';

const WHATSAPP_LINK = "https://wa.me/358401604442";

function PlanCard({ plan, locale, vertical = 'general' }: { plan: any; locale: Locale; vertical?: VerticalType }) {
    const pricingData = getPricing(vertical);
    const pricing = pricingData[plan.id as keyof typeof pricingData];

    const priceText = pricing ? formatPrice(pricing.monthlyEUR, locale, 'hasPlus' in pricing && pricing.hasPlus) : "";
    const setupText = pricing ? formatSetup(pricing.setupEUR, locale, 'hasPlus' in pricing && pricing.hasPlus) : "";

    const [loading, setLoading] = React.useState(false);

    const handleCTA = async () => {
        setLoading(true);
        trackEvent('pricing_cta_click', { plan_id: plan.id, language: locale });

        try {
            const res = await fetch('/api/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id, locale }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (err) {
            console.error(err);
            // Fallback to WhatsApp if Stripe fails or is not configured
            window.open(WHATSAPP_LINK, '_blank');
        } finally {
            setLoading(false);
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
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    className={[
                        "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all shadow-lg shadow-purple-500/10",
                        "bg-purple-500 text-white hover:bg-purple-500/90 hover:shadow-purple-500/20",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-0 disabled:opacity-50",
                    ].join(" ")}
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                        plan.cta
                    )}
                </motion.button>
            </div>
        </RevealItem>
    );
}

export default function Pricing({ locale, dict, vertical = 'general' }: { locale: Locale; dict: Dictionary; vertical?: VerticalType }) {
    useEffect(() => {
        trackEvent('pricing_view', { language: locale });
    }, [locale]);

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
                        <PlanCard key={p.name} plan={p} locale={locale} vertical={vertical} />
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