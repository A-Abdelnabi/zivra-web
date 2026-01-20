"use client";

import { Check, Plus } from "lucide-react";
import { Locale, Dictionary } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Reveal, RevealList, RevealItem } from '@/components/motion/Reveal';

function SocialPlanCard({ plan, locale }: { plan: any; locale: Locale }) {
    const handleCTA = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <RevealItem>
            <div
                className={[
                    "relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-500 h-full",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur",
                    plan.recommended ? "ring-1 ring-blue-500/60 shadow-[0_0_40px_rgba(59,130,246,0.1)]" : "",
                    "hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.01] active:scale-[0.99]"
                ].join(" ")}
            >
                {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs text-blue-200 z-10 flex items-center gap-1">
                        {plan.badge}
                    </div>
                )}

                <div className={locale === 'ar' ? 'text-right' : ''}>
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                </div>

                <div className={`mt-5 ${locale === 'ar' ? 'text-right' : ''}`}>
                    <div className="text-2xl font-semibold text-white tracking-tight">{plan.price}</div>
                </div>

                <ul className="mt-5 space-y-2 text-sm text-white/80">
                    {plan.bullets.map((b: string) => (
                        <li key={b} className="flex items-start gap-2">
                            <Check className={`mt-0.5 h-4 w-4 text-blue-300 shrink-0 ${locale === 'ar' ? 'order-2' : ''}`} />
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
                        "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all shadow-lg",
                        plan.recommended
                            ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20"
                            : "bg-white/10 text-white hover:bg-white/20",
                        "focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-0",
                    ].join(" ")}
                >
                    {plan.cta}
                </motion.button>
            </div>
        </RevealItem>
    );
}

export default function SocialPricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const sp = dict.social_pricing;
    if (!sp) return null;

    return (
        <section id="social-media" className="mx-auto w-full max-w-6xl px-4 py-24 border-t border-white/5">
            <Reveal>
                <div className="text-center">
                    <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                        {sp.badge}
                    </div>

                    <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
                        {sp.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70 whitespace-pre-line">
                        {sp.subtitle}
                    </p>
                </div>
            </Reveal>

            <RevealList delay={0.2}>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {sp.plans.map((p: any) => (
                        <SocialPlanCard key={p.name} plan={p} locale={locale} />
                    ))}
                </div>
            </RevealList>

            <Reveal delay={0.4}>
                <div className="mt-16 text-center max-w-2xl mx-auto">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-6">
                        {sp.addons.title}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {sp.addons.items.map((addon: any) => (
                            <div key={addon.name} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                <span className="text-sm text-white/90">{addon.name}</span>
                                <span className="text-sm font-semibold text-blue-300">{addon.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
            <Reveal delay={0.5}>
                <div className="mt-12 text-center">
                    <p className="text-xs text-white/40 italic">
                        {sp.disclaimer}
                    </p>
                </div>
            </Reveal>
        </section>
    );
}
