"use client";

import * as React from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Locale } from "@/lib/i18n";

export default function LeadCapture({ locale }: { locale: Locale }) {
    const [show, setShow] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [emailOrWa, setEmailOrWa] = React.useState("");
    const [name, setName] = React.useState("");

    React.useEffect(() => {
        // 1. 30s Delay Trigger
        const timer = setTimeout(() => {
            const hasDismissed = localStorage.getItem("zivra_lead_dismissed");
            if (!hasDismissed && !submitted) {
                setShow(true);
                trackEvent('lead_capture_view', { trigger: 'timer', language: locale });
            }
        }, 30000);

        return () => clearTimeout(timer);
    }, [submitted, locale]);

    const handleClose = () => {
        setShow(false);
        localStorage.setItem("zivra_lead_dismissed", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailOrWa.trim()) return;

        trackEvent('lead_capture_submit', {
            language: locale,
            has_name: !!name.trim()
        });

        // Silent submit to webhook or API
        try {
            await fetch('/api/webhooks/leads', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    contact: emailOrWa,
                    language: locale,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (e) { /* Silent fail */ }

        setSubmitted(true);
        setTimeout(() => setShow(false), 3000);
    };

    if (!show) return null;

    const isRtl = locale === 'ar';

    return (
        <div
            className="fixed bottom-28 right-6 md:right-32 z-[9998] animate-in fade-in slide-in-from-bottom-5 duration-700"
            dir={isRtl ? "rtl" : "ltr"}
        >
            <div className="relative w-[320px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden ring-1 ring-white/5">
                {/* Decoration */}
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                                {isRtl ? "محتاج مساعدة؟" : "Need a hand?"}
                            </h4>
                            <p className="text-[11px] text-white/50 leading-relaxed italic">
                                {isRtl
                                    ? "اترك رقمك أو بريدك وبنتواصل معك فوراً."
                                    : "Drop your contact and we'll call you back."}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder={isRtl ? "اسمك (اختياري)" : "Name (Optional)"}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                            />
                            <input
                                required
                                type="text"
                                placeholder={isRtl ? "واتساب أو إيميل" : "WhatsApp or Email"}
                                value={emailOrWa}
                                onChange={e => setEmailOrWa(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                <Send size={14} className={isRtl ? 'rotate-180' : ''} />
                                {isRtl ? "ارسل" : "Send"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="py-8 text-center animate-in zoom-in-95 duration-500">
                        <div className="mx-auto h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                            <MessageCircle className="text-green-500" size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white">
                            {isRtl ? "تمت المهمة بنجاح!" : "All set!"}
                        </h4>
                        <p className="text-xs text-white/40 mt-1">
                            {isRtl ? "بنتواصل معك في أقل من 24 ساعة." : "We'll be in touch within 24h."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
