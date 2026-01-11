"use client";

import { Check } from "lucide-react";

type Plan = {
    name: string;
    tagline: string;
    price: string;
    setup: string;
    recommended?: boolean;
    bullets: string[];
    cta: string;
};

const plans: Plan[] = [
    {
        name: "Starter",
        tagline: "For individuals & small startups.",
        price: "€149 / month",
        setup: "+ €999 setup",
        bullets: [
            "Website or Landing Page",
            "Basic AI Chat",
            "Multi-language Support",
            "Managed Hosting",
        ],
        cta: "Choose Starter",
    },
    {
        name: "Growth",
        tagline: "For restaurants, clinics & scaling businesses.",
        price: "€499 / month",
        setup: "+ €2499 setup",
        recommended: true,
        bullets: [
            "Custom Web App / Dashboard",
            "Business-Trained AI",
            "Restaurant Logic (Menu/Calories)",
            "WhatsApp Automation",
            "Automated Lead Follow-up",
            "Priority Support",
        ],
        cta: "Choose Growth",
    },
    {
        name: "Scale",
        tagline: "For serious brands & enterprises.",
        price: "€549 / month",
        setup: "+ €4999 setup",
        bullets: [
            "Full Custom Architecture",
            "Advanced AI Modeling",
            "Unlimited Modules",
            "Strategic Consulting",
            "Custom Integrations",
        ],
        cta: "Choose Scale",
    },
];

function PlanCard({ plan }: { plan: Plan }) {
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
                    Recommended
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
                {plan.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-purple-300" />
                        <span>{b}</span>
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

export default function Pricing() {
    return (
        <section id="packages" className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="text-center">
                <div className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                    Packages
                </div>

                <h2 className="mt-4 text-3xl font-semibold text-white">
                    Invest in Automation.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
                    Stop hiring more staff. Start scaling with calm intelligence.
                </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {plans.map((p) => (
                    <PlanCard key={p.name} plan={p} />
                ))}
            </div>
        </section>
    );
}