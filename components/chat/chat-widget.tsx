"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { Send } from "lucide-react";
import Portal from "@/components/ui/Portal";

type Role = "user" | "assistant";
type Lang = "ar" | "en";

type Msg = {
    id: string;
    role: Role;
    content: string;
    isContactCard?: boolean;
};

type ChatStep = 0 | 1 | 2;

type LeadData = {
    businessType?: string;
    goal?: string;
};

function getChatDict(lang: Lang) {
    if (lang === "ar") {
        return {
            step0: "هلا 👋 أنا مساعد ZIZO. وش نوع نشاطك التجاري؟",
            placeholder: "اكتب هنا...",
            typing: "جاري الكتابة...",
            bizTypes: ["مطعم / كافيه", "عيادة / طبي", "فندق / سياحة", "شركة خدمات", "متجر إلكتروني", "مشروع جديد"],
            goalPrompt: "ممتاز. وش هدفك الأساسي؟",
            goals: ["زيادة مبيعات", "توفير وقت", "رد آلي", "إطلاق مشروع"],
            ctaText: "تمام 👍 أسرع طريقة نخدمك بشكل مضبوط هي التواصل المباشر.\nاختَر اللي يناسبك:",
            whatsapp: "واتساب",
            email: "إيميل",
            whatsappSub: "رد سريع",
            emailSub: "عرض رسمي",
            closed: "تم إنهاء المحادثة"
        };
    }

    return {
        step0: "Hi 👋 I'm ZIZO. What type of business do you run?",
        placeholder: "Type here...",
        typing: "ZIZO is typing...",
        bizTypes: ["Restaurant / Café", "Clinic / Medical", "Hotel / Tourism", "Service Business", "E-commerce", "New Project"],
        goalPrompt: "Great. What's your main goal?",
        goals: ["Increase sales", "Save time", "Automated support", "Launch project"],
        ctaText: "Perfect 👍 The fastest way to help you is direct contact.\nChoose what works best:",
        whatsapp: "WhatsApp",
        email: "Email",
        whatsappSub: "Fast Response",
        emailSub: "Official Quote",
        closed: "Conversation Finished"
    };
}

// Helper to clear all chat storage
function clearChatStorage() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("zv_sales_lead");
    localStorage.removeItem("zv_sales_msgs");
    localStorage.removeItem("zv_sales_step");
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const lang: Lang = (locale as Lang) || "en";
    const dict = getChatDict(lang);

    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [options, setOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [lead, setLead] = React.useState<LeadData>({});
    const [step, setStep] = React.useState<ChatStep>(0);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Reset chat when locale changes
    React.useEffect(() => {
        clearChatStorage();
        setOpen(false);
        setMessages([]);
        setOptions([]);
        setLoading(false);
        setInput("");
        setLead({});
        setStep(0);
        setMounted(true);
    }, [locale]);

    // Initial state setup
    React.useEffect(() => {
        if (mounted && messages.length === 0) {
            setMessages([{ id: "init", role: "assistant", content: dict.step0 }]);
            setOptions(dict.bizTypes);
        }
    }, [mounted, messages.length, dict.step0, dict.bizTypes]);

    // Body scroll lock
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [open]);

    // Persistence (only save, don't restore to avoid stale state)
    React.useEffect(() => {
        if (mounted && messages.length > 0) {
            localStorage.setItem("zv_sales_lead", JSON.stringify(lead));
            localStorage.setItem("zv_sales_msgs", JSON.stringify(messages));
            localStorage.setItem("zv_sales_step", step.toString());
        }
    }, [lead, messages, step, mounted]);

    // Auto-scroll
    React.useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, loading]);

    const addMsg = (role: Role, content: string, isContactCard: boolean = false) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content, isContactCard }]);
    };

    const forceConversion = () => {
        setStep(2);
        setOptions([]);
        setLoading(false);
        addMsg("assistant", dict.ctaText, true);
    };

    const handleOption = (opt: string) => {
        if (step === 2 || loading) return;

        addMsg("user", opt);
        setLoading(true);
        setOptions([]);

        if (step === 0) {
            // Business type selected
            setLead(prev => ({ ...prev, businessType: opt }));
            setTimeout(() => {
                setStep(1);
                addMsg("assistant", dict.goalPrompt);
                setOptions(dict.goals);
                setLoading(false);
            }, 500);
        } else if (step === 1) {
            // Goal selected - go straight to conversion
            setLead(prev => ({ ...prev, goal: opt }));
            setTimeout(() => {
                forceConversion();
            }, 500);
        }
    };

    const handleCTA = (method: "whatsapp" | "email") => {
        if (method === "whatsapp") {
            window.open("https://wa.me/358401604442", "_blank");
        } else {
            window.location.href = "mailto:hello@zivra.dev";
        }
    };

    const sendMessage = () => {
        if (!input.trim() || step === 2 || loading) return;
        const text = input.trim();
        setInput("");
        addMsg("user", text);

        // For any free-form input, just move to conversion
        setTimeout(() => {
            forceConversion();
        }, 800);
    };

    const isRtl = lang === "ar";
    if (!mounted) return null;

    return (
        <>
            <Portal>
                {/* Root container - always mounted, visibility controlled by CSS */}
                <div
                    className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                >
                    {/* Modal Window */}
                    <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className={`absolute bottom-24 ${isRtl ? 'left-5 md:left-8' : 'right-5 md:right-8'} w-[400px] max-w-[calc(100vw-40px)] h-[600px] transition-all duration-500 ease-out flex flex-col rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 bg-black/80 backdrop-blur-3xl pointer-events-auto ${open ? 'translate-y-0' : 'translate-y-5'
                            }`}
                    >
                        {/* Decorative background - pointer-events-none */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" aria-hidden="true" />

                        {/* Content wrapper - pointer-events-auto */}
                        <div className="relative z-10 flex flex-col h-full pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-indigo-500/20">
                                        <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-white tracking-tight leading-none">ZIZO</h3>
                                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">
                                            {isRtl ? 'مساعد مبيعات' : 'Sales Assistant'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="h-9 w-9 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
                                    type="button"
                                >
                                    <span className="text-xl">✕</span>
                                </button>
                            </div>

                            {/* Messages */}
                            <div
                                ref={listRef}
                                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth overscroll-contain"
                            >
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        {m.isContactCard ? (
                                            <div className="w-full max-w-[90%] bg-indigo-600/10 rounded-3xl p-6 border-2 border-indigo-500/30 backdrop-blur-md shadow-2xl">
                                                <p className="text-sm font-bold text-white mb-6 leading-relaxed whitespace-pre-line">{m.content}</p>
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => handleCTA("whatsapp")}
                                                        type="button"
                                                        className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl p-4 transition-all"
                                                    >
                                                        <div className="h-11 w-11 rounded-full overflow-hidden border border-white/10 flex-shrink-0 relative">
                                                            <Image src="/images/zivra-logo.jpg" alt="" fill className="object-cover" />
                                                        </div>
                                                        <div className="flex-1 text-start">
                                                            <span className="text-sm font-black text-white block uppercase tracking-wide">{dict.whatsapp}</span>
                                                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{dict.whatsappSub}</span>
                                                        </div>
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,1)]" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleCTA("email")}
                                                        type="button"
                                                        className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl p-4 transition-all"
                                                    >
                                                        <div className="h-11 w-11 rounded-full overflow-hidden border border-white/10 flex-shrink-0 relative">
                                                            <Image src="/images/zivra-logo.jpg" alt="" fill className="object-cover" />
                                                        </div>
                                                        <div className="flex-1 text-start">
                                                            <span className="text-sm font-black text-white block uppercase tracking-wide">{dict.email}</span>
                                                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{dict.emailSub}</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${m.role === "user"
                                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none shadow-xl"
                                                    : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md"
                                                }`}>
                                                {m.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 rounded-2xl px-4 py-2 text-indigo-400 text-[10px] font-black tracking-widest uppercase animate-pulse">
                                            {dict.typing}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent border-t border-white/5">
                                {options.length > 0 && step < 2 && (
                                    <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2">
                                        {options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleOption(opt)}
                                                type="button"
                                                className="rounded-full bg-indigo-500/20 px-5 py-3 text-xs font-black text-white hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all border border-indigo-500/30"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {step < 2 ? (
                                    <div className="relative flex items-center gap-3">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                            placeholder={dict.placeholder}
                                            className="flex-1 h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 outline-none"
                                            type="text"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={loading || !input.trim()}
                                            type="button"
                                            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-20"
                                        >
                                            <Send size={18} className={isRtl ? 'rotate-180' : ''} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] uppercase tracking-[0.2em] font-black text-indigo-300">
                                        {dict.closed}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>

            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                type="button"
                className="fixed bottom-6 right-6 z-[10000] h-18 w-18 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center group overflow-hidden pointer-events-auto"
            >
                {open ? (
                    <span className="text-2xl font-light">✕</span>
                ) : (
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                        <div className="relative h-[70%] w-[70%] rounded-full overflow-hidden">
                            <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                        </div>
                    </div>
                )}
            </button>
        </>
    );
}