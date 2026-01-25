"use client";

import { Reveal, RevealList, RevealItem } from "@/components/motion/Reveal";
import { Locale, Dictionary } from "@/lib/i18n";
import { Magnet, TrendingUp, Megaphone, Zap, ArrowRight } from "lucide-react";

export default function UseCases({ locale }: { locale: Locale; dict: Dictionary }) {
    const isRtl = locale === 'ar';

    const cases = [
        {
            id: "leads",
            icon: <Magnet className="text-blue-500" size={24} />,
            title: isRtl ? "شركات تعتمد على العملاء المحتملين" : "Lead-Driven Businesses",
            problem: isRtl
                ? "العملاء يأتون من قنوات كثيرة بدون تنظيم واضح."
                : "Leads come from many channels, but nothing is organized.",
            solution: isRtl
                ? "ZIVRA تجمع كل العملاء من الإعلانات، واتساب، الموقع، والسوشيال ميديا في نظام مبيعات واحد."
                : "ZIVRA centralizes all leads from ads, WhatsApp, website, and social media into one automated sales system.",
            result: isRtl ? "تحويل أعلى، رد أسرع، وعدم ضياع أي فرصة." : "Higher conversion, faster response, zero missed opportunities.",
            color: "from-blue-500/10 to-transparent"
        },
        {
            id: "sales",
            icon: <TrendingUp className="text-emerald-500" size={24} />,
            title: isRtl ? "فرق مبيعات وشركات في مرحلة نمو" : "Sales Teams & Growth Companies",
            problem: isRtl
                ? "المبيعات تعتمد على الأفراد وليس الأنظمة."
                : "Sales performance depends on people, not systems.",
            solution: isRtl
                ? "مبيعات مدعومة بالذكاء الاصطناعي، CRM، متابعات تلقائية، ولوحات تحكم."
                : "AI-assisted sales flows, CRM pipelines, automated follow-ups, and performance tracking.",
            result: isRtl ? "صفقات أكثر، دورة بيع أقصر، ورؤية كاملة للإدارة." : "More closed deals, shorter sales cycles, full sales visibility.",
            color: "from-emerald-500/10 to-transparent"
        },
        {
            id: "marketing",
            icon: <Megaphone className="text-purple-500" size={24} />,
            title: isRtl ? "شركات تعتمد على التسويق والإعلانات" : "Marketing-Heavy Companies",
            problem: isRtl
                ? "نصرف على الإعلانات بدون معرفة ما الذي يحقق نتائج حقيقية."
                : "We spend on ads but don’t know what actually converts.",
            solution: isRtl
                ? "ZIVRA تربط الإعلانات، الصفحات، الشات الذكي، وCRM في Funnel واحد قابل للقياس."
                : "ZIVRA connects media buying, landing pages, AI chat, and CRM into one measurable funnel.",
            result: isRtl ? "عائد أعلى، تتبع أوضح، ونمو قابل للتوسع." : "Better ROI, clear attribution, scalable growth.",
            color: "from-purple-500/10 to-transparent"
        },
        {
            id: "automation",
            icon: <Zap className="text-orange-500" size={24} />,
            title: isRtl ? "شركات تعاني من ضغط تشغيلي" : "Operationally Busy Businesses",
            problem: isRtl
                ? "رسائل كثيرة، متابعات يدوية، وضغط يومي."
                : "Too many messages, follow-ups, and manual tasks.",
            solution: isRtl
                ? "أتمتة التوجيه، المتابعات، دعم العملاء، والعمليات الداخلية."
                : "Automation for lead routing, reminders, customer support, and internal workflows.",
            result: isRtl ? "مجهود أقل، توظيف أقل، وتركيز أكبر على النمو." : "Less workload, fewer hires, more focus on growth.",
            color: "from-orange-500/10 to-transparent"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-4 max-w-6xl">
                <Reveal>
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {isRtl ? "لمن تم بناء ZIVRA" : "Who ZIVRA is built for"}
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            {isRtl
                                ? "للشركات التي تبحث عن نمو مستدام، مبيعات مؤتمتة، ورؤية كاملة بدون فوضى."
                                : "Companies that want predictable growth, automated sales, and full visibility — without chaos."}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RevealList delay={0.2} staggerChildren={0.1}>
                        {cases.map((c) => (
                            <RevealItem key={c.id}>
                                <div className={`relative group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 bg-gradient-to-b ${c.color} h-full`}>
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
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all"
                        >
                            {isRtl ? "احجز استراتيجية مبيعات" : "Book Sales Strategy"}
                            <ArrowRight size={18} className={`${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                        </button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

