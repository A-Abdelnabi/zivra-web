"use client";

import { Reveal, RevealList, RevealItem } from "@/components/motion/Reveal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Pricing from "@/components/visual/pricing";
import { getDictionary, Locale, Dictionary } from "@/lib/i18n";
import { CheckCircle2, MessageSquare, Rocket, ArrowRight } from "lucide-react";
import React from "react";

export default function SaudiLandingPage({
    params,
}: {
    params: { locale: Locale };
}) {
    const [dict, setDict] = React.useState<Dictionary | null>(null);
    const locale = 'ar'; // Forced for this page

    React.useEffect(() => {
        getDictionary('ar').then(setDict);
    }, []);

    if (!dict) return null;

    const WHATSAPP_LINK = "https://wa.me/358401604442";

    return (
        <div className="flex min-h-screen flex-col" dir="rtl">
            <Navbar locale="ar" dict={dict} />

            <main className="flex-1 pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 max-w-6xl py-20 text-center">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            متاح الآن في المملكة العربية السعودية
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                            فعل مبيعاتك عبر <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">
                                الواتساب بالذكاء الاصطناعي
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                            ساعد عملائك، احجز مواعيدك، وقم بإنهاء صفقاتك تلقائياً وبكل احترافية. مساعدك الذكي متاح 24/7 دون توقف.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <a
                                href={WHATSAPP_LINK}
                                className="w-full md:w-auto px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <MessageSquare size={22} />
                                استشارة مجانية عبر الواتساب
                            </a>
                        </div>
                    </Reveal>
                </section>

                {/* Benefits */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <RevealList staggerChildren={0.1}>
                                <RevealItem>
                                    <div className="space-y-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold">سرعة الرد الاستثنائية</h3>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            لن تترك عميلاً ينتظر مجدداً. المساعد الذكي يرد في أجزاء من الثانية بلهجة احترافية دقيقة.
                                        </p>
                                    </div>
                                </RevealItem>
                                <RevealItem>
                                    <div className="space-y-4">
                                        <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                            <Rocket size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold">أتمتة العمليات بالكامل</h3>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            من حجز المواعيد إلى إرسال الفواتير ومتابعة العملاء، كل شيء يتم بشكل آلي تماماً.
                                        </p>
                                    </div>
                                </RevealItem>
                                <RevealItem>
                                    <div className="space-y-4">
                                        <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                            <MessageSquare size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold">زيادة المبيعات الحقيقية</h3>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            معدلات التحويل عبر الواتساب تفوق البريد الإلكتروني بـ 10 أضعاف. كن حيث يتواجد عملاؤك.
                                        </p>
                                    </div>
                                </RevealItem>
                            </RevealList>
                        </div>
                    </div>
                </section>

                {/* Packages */}
                <div id="packages">
                    <Pricing locale="ar" dict={dict} />
                </div>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="p-12 rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-900 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">هل أنت جاهز للنمو؟</h2>
                                <p className="text-indigo-100/70 text-lg mb-10 max-w-xl mx-auto">
                                    انضم إلى الشركات الذكية في السعودية التي قللت تكاليفها الكشفية بنسبة 30٪ باستخدام حلولنا.
                                </p>
                                <a
                                    href={WHATSAPP_LINK}
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-900 font-extrabold rounded-2xl hover:scale-105 transition-all shadow-xl"
                                >
                                    تحدث مع خبرائنا الآن
                                    <ArrowRight size={20} className="rotate-180" />
                                </a>
                            </div>

                            {/* Abstract Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                        </div>
                    </div>
                </section>
            </main>

            <Footer locale="ar" dict={dict} />
        </div>
    );
}
