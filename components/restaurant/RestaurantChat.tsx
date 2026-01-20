"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/restaurant/types";
import { MessageCircle, Phone, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { id: string; role: 'assistant' | 'user'; content: string; isContact?: boolean };

export default function RestaurantChat({
    locale,
    restaurantName,
    onContact
}: {
    locale: Locale;
    restaurantName: string;
    onContact: (method: 'whatsapp' | 'call') => void;
}) {
    const isRtl = locale === 'ar';
    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [step, setStep] = React.useState(0); // 0: Init, 1: Choice, 2: Converted
    const [open, setOpen] = React.useState(false);

    const reset = React.useCallback(() => {
        const welcome = locale === 'ar'
            ? `أهلاً بك في ${restaurantName}! كيف أخدمك اليوم؟`
            : `Welcome to ${restaurantName}! How can I help you today?`;
        setMessages([{ id: '1', role: 'assistant', content: welcome }]);
        setStep(1);
    }, [locale, restaurantName]);

    React.useEffect(() => {
        reset();
    }, [reset]);

    const handleChoice = (val: string) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: val }]);
        setTimeout(() => {
            const nextMsg = locale === 'ar' ? "ممتاز! كيف تفضل التواصل معنا؟" : "Great! How would you like to reach us?";
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: nextMsg, isContact: true }]);
            setStep(2);
        }, 500);
    };

    return (
        <>
            {/* Floating FAB */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none"
            >
                {open ? <X className="text-white" /> : <MessageCircle className="text-white" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-24 ${isRtl ? 'left-6' : 'right-6'} z-50 w-full max-w-[360px] h-[500px] bg-zinc-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col`}
                        dir={isRtl ? "rtl" : "ltr"}
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <MessageCircle className="text-primary" size={18} />
                                </div>
                                <span className="text-sm font-bold text-white uppercase tracking-tight">AI Assistant</span>
                            </div>
                            <button onClick={reset} className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <RefreshCw size={14} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(m => (
                                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {m.isContact ? (
                                        <div className="w-full space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <p className="text-xs font-medium text-zinc-400 mb-2">{m.content}</p>
                                            <button
                                                onClick={() => onContact('whatsapp')}
                                                className="w-full h-12 bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white border border-green-600/30 rounded-xl flex items-center justify-between px-4 transition-all"
                                            >
                                                <span className="font-bold">{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                                                <MessageCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => onContact('call')}
                                                className="w-full h-12 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-xl flex items-center justify-between px-4 transition-all"
                                            >
                                                <span className="font-bold">{locale === 'ar' ? 'اتصال هاتفي' : 'Phone Call'}</span>
                                                <Phone size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'
                                            }`}>
                                            {m.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Choices */}
                        {step === 1 && (
                            <div className="p-4 bg-black/20 border-t border-white/5 grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => handleChoice(locale === 'ar' ? 'أريد الطلب' : 'I want to order')}
                                    className="h-10 border border-white/10 hover:border-primary/50 bg-white/5 rounded-xl text-xs font-medium text-white transition-all"
                                >
                                    {locale === 'ar' ? 'اطلب طعام' : 'Order Food'}
                                </button>
                                <button
                                    onClick={() => handleChoice(locale === 'ar' ? 'لدي استفسار' : 'I have a question')}
                                    className="h-10 border border-white/10 hover:border-primary/50 bg-white/5 rounded-xl text-xs font-medium text-white transition-all"
                                >
                                    {locale === 'ar' ? 'اسأل سؤال' : 'Ask a Question'}
                                </button>
                            </div>
                        )}

                        {/* Footer Info */}
                        <div className="p-3 text-[9px] text-zinc-600 text-center uppercase tracking-widest border-t border-white/5">
                            Conversional-First AI by ZIVRA
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
