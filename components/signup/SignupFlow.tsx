"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, CreditCard, Clock, Store, Target } from "lucide-react";
import { SignupState, INITIAL_SIGNUP_STATE, ServiceIntent, BusinessType } from "@/lib/signup/types";
import { getSignupState, saveSignupState, getRecommendedPlan, initializeState } from "@/lib/signup/store";
import { trackEvent } from "@/lib/analytics";
import { getPricing, formatPrice, VerticalType } from "@/lib/pricing";

export default function SignupFlow({ locale, params }: { locale: 'ar' | 'en'; params: { businessType?: string; service?: string; source?: string } }) {
    const [state, setState] = React.useState<SignupState>(INITIAL_SIGNUP_STATE);
    const isRtl = locale === 'ar';

    React.useEffect(() => {
        const initialized = initializeState(locale);
        setState({
            ...initialized,
            businessType: (params.businessType as BusinessType) || initialized.businessType,
            intent: (params.service as ServiceIntent) || initialized.intent,
            source: params.source || initialized.source,
            lang: locale,
            selectedPlanId: params.service ? getRecommendedPlan(params.service as ServiceIntent) : initialized.selectedPlanId
        });
        trackEvent('signup_view', { source: params.source, intent: params.service });
    }, [params, locale]);

    const updateState = (updates: Partial<SignupState>) => {
        const newState = { ...state, ...updates };
        setState(newState);
        saveSignupState(newState);
    };

    const nextStep = () => {
        trackEvent('signup_step_completed', { step: state.step });
        updateState({ step: state.step + 1 });
        trackEvent('signup_step_started', { step: state.step + 1 });
    };

    const handleCreateTerminal = async (mode: 'now' | 'later') => {
        updateState({ loading: true, paymentMode: mode });

        try {
            // New: Post to leads API for CRM
            const leadData = {
                name: state.businessName,
                email: state.email,
                phone: state.whatsapp,
                businessType: state.businessType || "Restaurant",
                service: state.intent || "Ordering",
                source: 'demo_form' as const,
                notes: `City: ${state.city}, Platform: ${state.selectedPlanId}, Mode: ${mode}`,
            };
            fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(leadData)
            }).catch(() => { });

            // Simulated API call to create tenant/lead
            const res = await fetch('/api/tenant/create', {
                method: 'POST',
                body: JSON.stringify(state)
            });

            if (mode === 'now') {
                trackEvent('payment_started', { planId: state.selectedPlanId });
                // Redirect to stripe checkout
                window.location.href = `/api/billing/checkout?planId=${state.selectedPlanId}&email=${state.email}&businessName=${state.businessName}`;
            } else {
                trackEvent('trial_created', { planId: state.selectedPlanId });
                window.location.href = `/${locale}/onboarding/success?mode=later`;
            }
        } catch (e) {
            updateState({ loading: false, error: 'Request failed. Please try again or talk to us on WhatsApp.' });
        }
    };

    return (
        <div className={`min-h-[80vh] flex flex-col items-center justify-center p-4 ${isRtl ? 'font-cairo' : 'font-inter'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${state.step >= s ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {state.step === 1 && <Step1 key="s1" locale={locale} onNext={nextStep} />}
                    {state.step === 2 && <Step2 key="s2" locale={locale} state={state} update={updateState} onNext={nextStep} />}
                    {state.step === 3 && <Step4 key="s4" locale={locale} state={state} onAction={handleCreateTerminal} />}
                </AnimatePresence>

                {/* Always Visible Help */}
                <div className="mt-12 flex justify-center">
                    <a
                        href={`https://wa.me/9665XXXXXXXX?text=${encodeURIComponent(locale === 'ar' ? 'أحتاج مساعدة في التسجيل في ZIVRA' : 'I need help with ZIVRA signup')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium bg-white/5 px-6 py-3 rounded-full border border-white/5"
                    >
                        <MessageCircle size={18} className="text-primary" />
                        {locale === 'ar' ? 'تحتاج مساعدة؟ تواصل واتساب' : 'Need help? Talk to us on WhatsApp'}
                    </a>
                </div>
            </div>

            {/* Sticky Floating Lead Trap */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-8 right-8 z-[100]"
            >
                <a
                    href={`https://wa.me/9665XXXXXXXX?text=${encodeURIComponent(locale === 'ar' ? 'أحتاج مساعدة فورية' : 'I need help now')}`}
                    target="_blank"
                    className="h-14 w-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 transition-all group"
                >
                    <MessageCircle size={28} />
                    <div className="absolute right-16 bg-black text-white px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {locale === 'ar' ? 'تحدث معنا الآن' : 'Talk to us now'}
                    </div>
                </a>
            </motion.div>
        </div>
    );
}

// --- Sub-components (Simplified for brevity in artifact, would be separate files in real app) ---

function Step1({ locale, onNext }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-[24px] flex items-center justify-center mx-auto mb-8 text-primary">
                <Store size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                {locale === 'ar' ? 'جاهز نفعّل النظام لمطعمك؟' : 'Ready to activate your system?'}
            </h1>
            <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
                {locale === 'ar' ? 'خلال دقيقتين هنجهز حسابك ونبعت لك أول خطوة.' : 'In 2 minutes, we will set up your account and send the next steps.'}
            </p>
            <button onClick={onNext} className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                {locale === 'ar' ? 'ابدأ الآن' : 'Start Now'}
                <ArrowRight size={24} />
            </button>
        </motion.div>
    );
}

function Step2({ locale, state, update, onNext }: any) {
    const isValid = state.businessName && state.city && state.whatsapp && state.consent;

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold">{locale === 'ar' ? 'بيانات المطعم' : 'Restaurant Info'}</h2>
                <p className="text-zinc-500 text-sm mt-2">{locale === 'ar' ? 'نحتاج بيانات بسيطة لبدء الإعداد' : 'We need basic info to start setup'}</p>
            </div>

            <div className="space-y-4">
                <Input label={locale === 'ar' ? 'اسم المطعم' : 'Restaurant Name'} value={state.businessName} onChange={(v: string) => update({ businessName: v })} placeholder="e.g. Cairo Deli" />
                <Input label={locale === 'ar' ? 'المدينة' : 'City'} value={state.city} onChange={(v: string) => update({ city: v })} placeholder="e.g. Riyadh" />
                <Input label={locale === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'} value={state.whatsapp} onChange={(v: string) => update({ whatsapp: v })} placeholder="9665XXXXXXXX" />

                <div onClick={() => update({ consent: !state.consent })} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/30 transition-all">
                    <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${state.consent ? 'bg-primary border-primary' : 'border-zinc-700'}`}>
                        {state.consent && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                        {locale === 'ar'
                            ? 'بالضغط على (موافق) أنت توافق على سياسة الخصوصية وتسمح بالتواصل بخصوص طلبك.'
                            : 'By clicking agree, you accept the privacy policy and allow us to contact you regarding your order.'}
                    </p>
                </div>
            </div>

            <button disabled={!isValid} onClick={onNext} className="w-full h-14 bg-primary disabled:opacity-30 text-white rounded-2xl font-bold text-lg transition-all">
                {locale === 'ar' ? 'التالي' : 'Next'}
            </button>
        </motion.div>
    );
}


function Step4({ locale, state, onAction }: any) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">{locale === 'ar' ? 'الخطوة الأخيرة' : 'Last Step'}</h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 text-sm">
                    <p className="font-bold text-white mb-1">ZIVRA Restaurant Starter</p>
                    <p className="text-zinc-500 font-medium">$49/mo + $149 {locale === 'ar' ? 'رسوم تأسيس' : 'setup fee'}</p>
                </div>
                <p className="text-zinc-500 text-sm">{locale === 'ar' ? 'كيف تود تفعيل اشتراكك؟' : 'How would you like to activate?'}</p>
            </div>

            <div className="grid gap-4">
                <button
                    disabled={state.loading}
                    onClick={() => onAction('now')}
                    className="group h-24 bg-white border border-transparent hover:border-primary rounded-[28px] overflow-hidden transition-all flex items-center px-8 text-black"
                >
                    <div className="flex-1 text-left">
                        <span className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Fast Route</span>
                        <span className="text-xl font-black">{locale === 'ar' ? 'ادفع الآن وفعل النظام' : 'Pay Now & Activate'}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight size={20} />
                    </div>
                </button>

                <button
                    disabled={state.loading}
                    onClick={() => onAction('later')}
                    className="h-20 bg-white/5 border border-white/10 hover:border-white/30 rounded-[28px] flex flex-col items-center justify-center transition-all text-white"
                >
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-zinc-500" />
                        <span className="font-bold">{locale === 'ar' ? 'تفعيل تجريبي بضمان ZIVRA' : 'Activate 14-Day Free Deposit'}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mt-1">
                        {locale === 'ar' ? 'ابدأ الآن وادفع لاحقاً' : 'Start now, pay later'}
                    </span>
                </button>
            </div>

            {state.loading && (
                <div className="text-center text-xs font-bold text-primary animate-pulse uppercase tracking-widest">
                    {locale === 'ar' ? 'جاري إنشاء حسابك...' : 'Creating your account...'}
                </div>
            )}
        </motion.div>
    );
}

function Input({ label, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-14 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl px-6 text-white outline-none transition-all placeholder:text-zinc-700 font-medium"
            />
        </div>
    );
}
