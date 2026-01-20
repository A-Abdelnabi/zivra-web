"use client";

import * as React from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Locale } from "@/lib/i18n";
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Rocket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardingContent({ locale }: { locale: Locale }) {
    const isRtl = locale === 'ar';
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);

    const [formData, setFormData] = React.useState({
        businessName: "",
        businessType: "",
        whatsappNumber: "",
        mainService: "",
        contactPreference: "whatsapp",
    });

    const steps = [
        { id: "businessName", label: isRtl ? "اسم النشاط" : "Business Name" },
        { id: "businessType", label: isRtl ? "نوع النشاط" : "Business Type" },
        { id: "whatsappNumber", label: isRtl ? "رقم الواتساب" : "WhatsApp Number" },
        { id: "mainService", label: isRtl ? "الخدمة الأساسية" : "Main Service" },
        { id: "contactPreference", label: isRtl ? "تفضيل التواصل" : "Contact Preference" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const next = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };

    const back = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch('/api/onboarding/complete', {
                method: 'POST',
                body: JSON.stringify({ ...formData, sessionId, locale }),
            });
            setCompleted(true);

            // Send welcome message via our simulate flow
            setTimeout(() => {
                router.push(`/${locale}`);
            }, 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4" dir={isRtl ? "rtl" : "ltr"}>
                <Reveal>
                    <div className="text-center space-y-6 max-w-md">
                        <div className="mx-auto h-20 w-20 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Rocket size={40} className="animate-bounce" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            {isRtl ? "تم التفعيل بنجاح! 🚀" : "ZIVRA is Activated! 🚀"}
                        </h1>
                        <p className="text-white/60 leading-relaxed">
                            {isRtl
                                ? "لقد تم إعداد مساعدك الذكي. استلمت الآن رسالة ترحيبية على الواتساب."
                                : "Your AI assistant is being configured. You've just received a welcome message on WhatsApp."}
                        </p>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-inter" dir={isRtl ? "rtl" : "ltr"}>
            <div className="container mx-auto max-w-xl px-4 py-20 min-h-screen flex flex-col">
                <Reveal>
                    <div className="mb-12 space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isRtl ? "لنبدأ الإعداد" : "Let's Get Started"}
                        </h1>
                        <p className="text-white/50 text-sm">
                            {isRtl
                                ? "أكمل البيانات التالية لتفعيل الأتمتة فوراً."
                                : "Complete these details to activate your automation immediately."}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-12 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                        <div className="min-h-[120px]">
                            {step === 0 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <label className="text-sm font-bold text-white/70 block uppercase tracking-widest">{steps[0].label}</label>
                                    <input
                                        autoFocus
                                        required
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder={isRtl ? "مثال: مطعم زيفرا" : "e.g. ZIVRA Restaurant"}
                                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl outline-none focus:border-indigo-500 transition-colors placeholder:text-white/5"
                                    />
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <label className="text-sm font-bold text-white/70 block uppercase tracking-widest">{steps[1].label}</label>
                                    <select
                                        autoFocus
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="" className="bg-neutral-900 text-white/20 text-base">{isRtl ? "اختر النوع" : "Select Type"}</option>
                                        <option value="restaurant" className="bg-neutral-900 text-white text-base">{isRtl ? "مطعم / كافيه" : "Restaurant / Café"}</option>
                                        <option value="clinic" className="bg-neutral-900 text-white text-base">{isRtl ? "عيادة طبية" : "Medical Clinic"}</option>
                                        <option value="ecommerce" className="bg-neutral-900 text-white text-base">{isRtl ? "متجر إلكتروني" : "E-commerce"}</option>
                                        <option value="service" className="bg-neutral-900 text-white text-base">{isRtl ? "شركة خدمات" : "Service Business"}</option>
                                    </select>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <label className="text-sm font-bold text-white/70 block uppercase tracking-widest">{steps[2].label}</label>
                                    <input
                                        autoFocus
                                        required
                                        type="tel"
                                        name="whatsappNumber"
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                        placeholder="+966 5X XXX XXXX"
                                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl outline-none focus:border-indigo-500 transition-colors placeholder:text-white/5"
                                    />
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <label className="text-sm font-bold text-white/70 block uppercase tracking-widest">{steps[3].label}</label>
                                    <select
                                        autoFocus
                                        name="mainService"
                                        value={formData.mainService}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="" className="bg-neutral-900 text-white/20 text-base">{isRtl ? "اختر الخدمة" : "Select Service"}</option>
                                        <option value="ordering" className="bg-neutral-900 text-white text-base">{isRtl ? "الرد على الطلبات" : "Order Management"}</option>
                                        <option value="booking" className="bg-neutral-900 text-white text-base">{isRtl ? "حجز المواعيد" : "Appointment Booking"}</option>
                                        <option value="faq" className="bg-neutral-900 text-white text-base">{isRtl ? "الرد على الاستفسارات" : "FAQ & Inquiries"}</option>
                                    </select>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <label className="text-sm font-bold text-white/70 block uppercase tracking-widest">{steps[4].label}</label>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, contactPreference: "whatsapp" })}
                                            className={`p-6 rounded-2xl border-2 transition-all text-center space-y-2 ${formData.contactPreference === "whatsapp" ? "border-indigo-500 bg-indigo-500/10" : "border-white/5 bg-white/5"}`}
                                        >
                                            <span className="block font-bold">WhatsApp</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, contactPreference: "email" })}
                                            className={`p-6 rounded-2xl border-2 transition-all text-center space-y-2 ${formData.contactPreference === "email" ? "border-indigo-500 bg-indigo-500/10" : "border-white/5 bg-white/5"}`}
                                        >
                                            <span className="block font-bold">Email</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-12 border-t border-white/5">
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={back}
                                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <ArrowLeft size={24} className={isRtl ? 'rotate-180' : ''} />
                                </button>
                            ) : <div />}

                            {step < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    disabled={!formData[steps[step].id as keyof typeof formData]}
                                    className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isRtl ? "التالي" : "Next"}
                                    <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-4 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                    ) : (
                                        <>
                                            {isRtl ? "تفعيل الحساب" : "Activate Account"}
                                            <Send size={20} className={isRtl ? 'rotate-180' : ''} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </Reveal>
            </div>
        </div>
    );
}

export default function OnboardingPage({ params }: { params: { locale: Locale } }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <OnboardingContent locale={params.locale} />
        </Suspense>
    );
}
