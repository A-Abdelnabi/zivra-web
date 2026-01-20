"use client";

import { Reveal, RevealList, RevealItem } from "@/components/motion/Reveal";
import { Locale, Dictionary } from "@/lib/i18n";
import { Building2, Stethoscope, Coffee, ArrowRight } from "lucide-react";

export default function UseCases({ locale }: { locale: Locale; dict: Dictionary }) {
    const isRtl = locale === 'ar';

    const cases = [
        {
            id: "restaurant",
            icon: <Coffee className="text-orange-500" size={24} />,
            title: isRtl ? "المطاعم والكافيهات" : "Restaurants & Cafés",
            problem: isRtl
                ? "استقبال الطلبات وقت الزحمة عبر الواتساب يشتت الفريق."
                : "Managing rush-hour orders via manual WhatsApp chats is chaotic.",
            solution: isRtl
                ? "أتمتة الطلبات عبر منيو رقمي وربطه بنظام المحاسبة."
                : "Automate ordering with a digital menu synced to your POS.",
            result: isRtl ? "توفير ~25% من وقت الموظفين." : "Save ~25% of staff efficiency.",
            color: "from-orange-500/10 to-transparent"
        },
        {
            id: "clinic",
            icon: <Stethoscope className="text-blue-500" size={24} />,
            title: isRtl ? "العيادات والمراكز الطبية" : "Clinics & Medical Centers",
            problem: isRtl
                ? "فقدان مواعيد بسبب تأخر الرد على استفسارات العملاء."
                : "Losing appointments due to delayed responses to simple inquiries.",
            solution: isRtl
                ? "مساعد ذكاء اصطناعي يحجز المواعيد ويرد على الأسئلة الشائعة 24/7."
                : "AI assistant that handles booking and FAQs 24/7.",
            result: isRtl ? "تقليل المكالمات الفائتة بنسبة 40%." : "Reduce missed inquiries by ~40%.",
            color: "from-blue-500/10 to-transparent"
        },
        {
            id: "service",
            icon: <Building2 className="text-emerald-500" size={24} />,
            title: isRtl ? "قطاع الخدمات (صيانة/تجميل)" : "Service Businesses",
            problem: isRtl
                ? "صعوبة متابعة العملاء المحتملين يدوياً."
                : "Difficulty following up with leads manually via spreadsheets.",
            solution: isRtl
                ? "ربط الواتساب بنظام CRM لتسجيل المواعيد فوراً."
                : "Inject WhatsApp leads directly into a mini-CRM for instant follow-up.",
            result: isRtl ? "زيادة معدل تحوير العملاء 30%." : "Boost conversion rate by ~30%.",
            color: "from-emerald-500/10 to-transparent"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-4 max-w-6xl">
                <Reveal>
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {isRtl ? "لمن تم بناء ZIVRA؟" : "Who ZIVRA is built for"}
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            {isRtl
                                ? "نحن لا نبني فقط برمجيات، نحن نصمم حلولاً تزيد من مبيعاتك وتوفر وقتك في القطاعات الأكثر حيوية."
                                : "We don't just build software. We engineer systems that scale sales and save time for high-growth sectors."}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RevealList delay={0.2} staggerChildren={0.1}>
                        {cases.map((c) => (
                            <RevealItem key={c.id}>
                                <div className={`relative group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 bg-gradient-to-b ${c.color}`}>
                                    <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                                        {c.icon}
                                    </div>

                                    <h3 className="text-xl font-bold mb-6">{c.title}</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                                                {isRtl ? "المشكلة" : "Problem"}
                                            </span>
                                            <p className="text-sm text-white/60 leading-relaxed italic">
                                                "{c.problem}"
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                                                {isRtl ? "الحل" : "Solution"}
                                            </span>
                                            <p className="text-sm text-white/80 leading-relaxed font-semibold">
                                                {c.solution}
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 mt-auto">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block">
                                                        {isRtl ? "النتيجة المتوقعة" : "Expected Result"}
                                                    </span>
                                                    <p className="text-base font-bold text-white">
                                                        {c.result}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </RevealItem>
                        ))}
                    </RevealList>
                </div>

                <Reveal delay={0.8}>
                    <div className="mt-16 text-center">
                        <button
                            onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all"
                        >
                            {isRtl ? "ابدأ الآن" : "Start now"}
                            <ArrowRight size={18} className={`${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                        </button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
