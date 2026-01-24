"use client";

import * as React from "react";
import { useEffect } from "react";

import { Check } from "lucide-react";
import { Locale, Dictionary } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Reveal, RevealList, RevealItem } from '@/components/motion/Reveal';
import { track } from '@/lib/track';

const WHATSAPP_LINK = "https://wa.me/358401604442";

function PlanCard({ plan, locale }: { plan: any; locale: Locale }) {
    const [loading, setLoading] = React.useState(false);

    const handleCTA = () => {
        setLoading(true);
        const leadData = {
            name: "",
            businessType: "Multi-Industry",
            service: plan.name,
            phone: "Visitor clicked CTA",
            email: "",
            source: 'demo_form' as const,
            notes: `Pricing Plan: ${plan.name} | Loc: ${locale}`,
        };
        track('book_demo_click', { language: locale, ...leadData });
        fetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify(leadData)
        }).catch(() => { });
        // Direct to signup/contact with relevant plan
        window.location.href = `/${locale}/signup?service=${plan.id}&source=pricing`;
    };

    return (
        <RevealItem>
            <div
                className={[
                    "relative mx-auto w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-500 flex flex-col h-full",
                    "shadow-[0_0_80px_rgba(139,92,246,0.1)] backdrop-blur-xl",
                    "ring-1 ring-purple-500/40",
                    "hover:bg-white/[0.06] hover:border-white/20"
                ].join(" ")}
            >
                {/* Badge for featured/most popular */}
                {plan.id === 'growth' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-purple-500/40 bg-purple-500 px-4 py-1.5 text-xs font-bold text-white z-10 uppercase tracking-widest shadow-lg shadow-purple-500/50">
                        {locale === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular'}
                    </div>
                )}

                <div className={locale === 'ar' ? 'text-right' : ''}>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm text-white/50">{plan.tagline}</p>
                </div>

                <div className={`mt-8 ${locale === 'ar' ? 'text-right' : ''}`}>
                    <div className="text-4xl font-black text-white tracking-tight">{plan.price}</div>
                    <div className="mt-2 text-sm font-medium text-purple-300/80">{plan.setup}</div>
                </div>

                <ul className="mt-8 space-y-4 text-sm text-white/80 flex-1">
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
                        plan.id === 'growth' ? "bg-purple-500 text-white" : "bg-white/10 text-white border border-white/10",
                        "hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-400/60 disabled:opacity-50",
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
        track('pricing_view', { source: 'pricing', language: locale });
    }, [locale]);

    return (
        <section id="packages" className="mx-auto w-full max-w-7xl px-4 py-24 mb-12">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {dict.pricing.plans.map((p: any) => (
                    <PlanCard key={p.id} plan={p} locale={locale} />
                ))}
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