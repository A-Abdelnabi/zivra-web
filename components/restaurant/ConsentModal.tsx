"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { Locale } from "@/lib/restaurant/types";

export function ConsentModal({
    locale,
    privacyText,
    onAccept,
    onCancel
}: {
    locale: Locale;
    privacyText: string;
    onAccept: () => void;
    onCancel: () => void;
}) {
    const isRtl = locale === 'ar';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
                    dir={isRtl ? "rtl" : "ltr"}
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <ShieldCheck size={28} />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4">
                            {locale === 'ar' ? "حماية بياناتك" : "Privacy & Compliance"}
                        </h2>

                        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                            {privacyText}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onAccept}
                                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {locale === 'ar' ? "أوافق وأتابع" : "I Accept & Continue"}
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full h-14 bg-white/5 text-zinc-400 rounded-2xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                {locale === 'ar' ? "إلغاء" : "Cancel"}
                            </button>
                        </div>

                        <p className="mt-6 text-[10px] text-zinc-500 text-center uppercase tracking-widest">
                            {locale === 'ar' ? "متوافق مع نظام حماية البيانات السعودي (PDPL)" : "Compliant with Saudi PDPL Regulations"}
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
