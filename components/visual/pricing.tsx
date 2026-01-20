"use client";

import { Check } from "lucide-react";
import { Locale, Dictionary } from '@/lib/i18n';

function PlanCard({ plan, locale }: { plan: any; locale: Locale }) {
    return (
        <div
            className={[
                "relative rounded-2xl border border-white/10 bg-white/[0.04] p-6",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur",
                plan.recommended ? "ring-1 ring-purple-500/60" : "",
            ].join(" ")}
        >
            {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
                    {locale === 'ar' ? 'موصى به' : 'Recommended'}
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/70">{plan.tagline}</p>
            </div>

            <div className="mt-5">
                <div className="text-2xl font-semibold text-white">{plan.price}</div>
                <div className="mt-1 text-sm text-white/70">{plan.setup}</div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-white/80">
                {plan.bullets.map((b: string) => (
                    <li key={b} className="flex items-start gap-2">
                        <Check className={`mt-0.5 h-4 w-4 text-purple-300 shrink-0 ${locale === 'ar' ? 'order-2' : ''}`} />
                        <span className={locale === 'ar' ? 'text-right' : ''}>{b}</span>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
                    "bg-purple-500 text-white hover:bg-purple-500/90",
                    "focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-0",
                ].join(" ")}
            >
                {plan.cta}
            </button>
        </div>
    );
}

export default function Pricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section id="packages" className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="text-center">
                <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                    {dict.pricing.badge}
                </div>

                <h2 className="mt-4 text-3xl font-semibold text-white">
                    {dict.pricing.title}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
                    {dict.pricing.subtitle}
                </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {dict.pricing.plans.map((p) => (
                    <PlanCard key={p.name} plan={p} locale={locale} />
                ))}
            </div>
        </section>
    );
}