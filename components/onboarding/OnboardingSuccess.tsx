"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Menu, MessageCircle, Calendar, ArrowRight, Store } from "lucide-react";
import { clearSignupState } from "@/lib/signup/store";

export default function OnboardingSuccess({ locale, mode }: { locale: 'ar' | 'en'; mode: 'now' | 'later' }) {
    const isRtl = locale === 'ar';

    React.useEffect(() => {
        clearSignupState();
    }, []);

    return (
        <div className={`min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 ${isRtl ? 'font-cairo' : 'font-inter'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-2xl text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="h-24 w-24 bg-primary text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/40"
                >
                    <CheckCircle2 size={48} />
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    {locale === 'ar' ? 'تم إنشاء حسابك!' : 'Account Created!'}
                </h1>

                <p className="text-zinc-400 text-lg mb-12 max-w-md mx-auto">
                    {mode === 'later'
                        ? (locale === 'ar' ? 'بإمكانك البدء الآن مجاناً. تواصلنا معك عبر واتساب لتكملة الإعداد.' : 'You can start for free now. We messaged you on WhatsApp to complete setup.')
                        : (locale === 'ar' ? 'شكراً لثقتك! نظامك جاهز للبدء الآن.' : 'Thanks for your trust! Your system is ready to start.')
                    }
                </p>

                {/* Growth Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <ActionCard
                        icon={Menu}
                        title={locale === 'ar' ? 'رفع المنيو' : 'Upload Menu'}
                        sub={locale === 'ar' ? 'أرسل قائمة الطعام لنا' : 'Send your menu items'}
                    />
                    <ActionCard
                        icon={Calendar}
                        title={locale === 'ar' ? 'حجز مكالمة' : 'Book a Call'}
                        sub={locale === 'ar' ? 'جلسة تدريب سريعة' : 'Quick training session'}
                    />
                    <ActionCard
                        icon={Store}
                        title={locale === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                        sub={locale === 'ar' ? 'إدارة المنيو والطلبات' : 'Manage menu & orders'}
                    />
                    <ActionCard
                        icon={MessageCircle}
                        title={locale === 'ar' ? 'دعم الواتساب' : 'WhatsApp Support'}
                        sub={locale === 'ar' ? 'فريقنا معك في أي وقت' : 'We are here 24/7'}
                    />
                </div>

                <button className="h-16 px-10 bg-white text-black rounded-2xl font-black text-lg hover:scale-[1.05] transition-all flex items-center justify-center gap-3 mx-auto">
                    {locale === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}

function ActionCard({ icon: Icon, title, sub }: any) {
    return (
        <div className="bg-white/5 border border-white/5 p-6 rounded-[28px] text-left hover:border-primary/30 transition-all group cursor-pointer">
            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <Icon size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">{sub}</p>
        </div>
    );
}
