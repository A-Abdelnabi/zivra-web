"use client";

import * as React from "react";

import { Check } from "lucide-react";
import { Locale, Dictionary } from '@/lib/i18n';
import { getPricing, formatPrice, formatSetup, VerticalType, PRICING_DATA } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { Reveal, RevealList, RevealItem } from '@/components/motion/Reveal';
import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';

const WHATSAPP_LINK = "https://wa.me/9665XXXXXXXX";

function PlanCard({ plan, locale }: { plan: any; locale: Locale }) {
    const pricing = PRICING_DATA.starter;

    const priceText = formatPrice(pricing.monthlyUSD, locale);
    const setupText = formatSetup(pricing.setupUSD, locale);

    const [loading, setLoading] = React.useState(false);

    const handleCTA = () => {
        setLoading(true);
        trackEvent('pricing_cta_click', { plan_id: plan.id, language: locale });
        // Direct to demo for the single offer
        window.location.href = `/${locale}/signup?service=ordering&source=pricing`;
    };

    return (
        <RevealItem>
            <div
                className={[
                    "relative mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-500",
                    "shadow-[0_0_80px_rgba(139,92,246,0.1)] backdrop-blur-xl",
                    "ring-1 ring-purple-500/40",
                    "hover:bg-white/[0.06] hover:border-white/20"
                ].join(" ")}
            >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-purple-500/40 bg-purple-500/20 px-4 py-1.5 text-xs font-bold text-purple-200 z-10 uppercase tracking-widest">
                    {locale === 'ar' ? 'الباقة الشاملة' : 'All-In-One Package'}
                </div>

                <div className={locale === 'ar' ? 'text-right' : ''}>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm text-white/50">{plan.tagline}</p>
                </div>

                <div className={`mt-8 ${locale === 'ar' ? 'text-right' : ''}`}>
                    <div className="text-4xl font-black text-white tracking-tight">{priceText}</div>
                    <div className="mt-2 text-sm font-medium text-purple-300/80">{setupText}</div>
                </div>

                <ul className="mt-8 space-y-4 text-sm text-white/80">
                    {plan.bullets.map((b: string) => (
                        <li key={b} className="flex items-start gap-3">
                            <Check className={`mt-0.5 h-5 w-5 text-purple-400 shrink-0 ${locale === 'ar' ? 'order-2' : ''}`} />
                            <span className={locale === 'ar' ? 'text-right flex-1 font-medium' : 'font-medium'}>{b}</span>
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
                        "mt-10 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-lg font-bold transition-all shadow-xl shadow-purple-500/20",
                        "bg-purple-500 text-white hover:bg-purple-400 hover:shadow-purple-500/40",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400/60 disabled:opacity-50",
                    ].join(" ")}
                >
                    {loading ? (
                        <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                        plan.cta
                    )}
                </motion.button>

                <div className="mt-6 text-center">
                    <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        className="text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4"
                    >
                        {locale === 'ar' ? 'أو تحدث معنا على واتساب' : 'Or talk on WhatsApp'}
                    </a>
                </div>
            </div>
        </RevealItem>
    );
}

export default function Pricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    useEffect(() => {
        trackEvent('pricing_view', { language: locale });
    }, [locale]);

    const plan = dict.pricing.plans[0];

    return (
        <section id="packages" className="mx-auto w-full max-w-6xl px-4 py-24 mb-12">
            <Reveal>
                <div className="text-center mb-16">
                    <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-bold text-white/50 backdrop-blur-sm uppercase tracking-widest">
                        {dict.pricing.badge}
                    </div>

                    <h2 className="mt-6 text-4xl md:text-6xl font-black text-white">
                        {dict.pricing.title}
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
                        {dict.pricing.subtitle}
                    </p>
                </div>
            </Reveal>

            <div className="flex justify-center">
                <PlanCard plan={plan} locale={locale} />
            </div>

            <Reveal delay={0.5}>
                <div className="mt-16 text-center">
                    <p className="text-xs text-white/20 font-medium">
                        {dict.pricing.disclaimer}
                    </p>
                </div>
            </Reveal>
        </section>
    );
}