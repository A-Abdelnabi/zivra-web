"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { Send, RefreshCw } from "lucide-react";
import Portal from "@/components/ui/Portal";

type Role = "user" | "assistant";
type Lang = "ar" | "en";

type Msg = {
    id: string;
    role: Role;
    content: string;
    isContactCard?: boolean;
};

type ChatStep = "BUSINESS" | "SERVICE" | "CONTACT" | "DONE";

type LeadData = {
    businessType?: string | null;
    serviceInterest?: string | null;
    conversationId: string;
};

const BIZ_OPTIONS = {
    en: [
        "Restaurant / Café",
        "Clinic / Medical",
        "Hotel / Tourism",
        "Service Business",
        "E-commerce",
        "Startup / SaaS",
        "Other",
        "I need help"
    ],
    ar: [
        "مطعم / كافيه",
        "عيادة / طبي",
        "فندق / سياحة",
        "شركة خدمات",
        "متجر إلكتروني",
        "شركة تقنية / SaaS",
        "أخرى",
        "محتاج مساعدة"
    ]
};

const SERVICE_MAPPING: Record<string, { en: string[], ar: string[] }> = {
    "Restaurant / Café": {
        en: ["Ordering chatbot", "WhatsApp automation", "Website/Menu", "Marketing"],
        ar: ["شات بوت للطلبات", "أتمتة واتساب", "موقع/منيو", "تسويق"]
    },
    "مطعم / كافيه": {
        en: ["Ordering chatbot", "WhatsApp automation", "Website/Menu", "Marketing"],
        ar: ["شات بوت للطلبات", "أتمتة واتساب", "موقع/منيو", "تسويق"]
    },
    "Clinic / Medical": {
        en: ["Appointment chatbot", "Lead follow-up", "Website/Landing", "WhatsApp reminders"],
        ar: ["شات بوت للحجوزات", "متابعة العملاء", "موقع/صفحة هبوط", "تذكير واتساب"]
    },
    "عيادة / طبي": {
        en: ["Appointment chatbot", "Lead follow-up", "Website/Landing", "WhatsApp reminders"],
        ar: ["شات بوت للحجوزات", "متابعة العملاء", "موقع/صفحة هبوط", "تذكير واتساب"]
    },
    "Hotel / Tourism": {
        en: ["Booking chatbot", "Website", "Automation", "Marketing"],
        ar: ["شات بوت للحجز", "موقع", "أتمتة", "تسويق"]
    },
    "فندق / سياحة": {
        en: ["Booking chatbot", "Website", "Automation", "Marketing"],
        ar: ["شات بوت للحجز", "موقع", "أتمتة", "تسويق"]
    },
    "Service Business": {
        en: ["Lead capture", "Website", "Automation", "Marketing"],
        ar: ["جمع عملاء", "موقع", "أتمتة", "تسويق"]
    },
    "شركة خدمات": {
        en: ["Lead capture", "Website", "Automation", "Marketing"],
        ar: ["جمع عملاء", "موقع", "أتمتة", "تسويق"]
    },
    "E-commerce": {
        en: ["Support chatbot", "WhatsApp automation", "Website", "Marketing"],
        ar: ["شات بوت دعم", "أتمتة واتساب", "موقع", "تسويق"]
    },
    "متجر إلكتروني": {
        en: ["Support chatbot", "WhatsApp automation", "Website", "Marketing"],
        ar: ["شات بوت دعم", "أتمتة واتساب", "موقع", "تسويق"]
    },
    "Startup / SaaS": {
        en: ["Product website", "Automation", "AI assistant", "Integrations"],
        ar: ["موقع للمنتج", "أتمتة", "مساعد AI", "تكاملات"]
    },
    "شركة تقنية / SaaS": {
        en: ["Product website", "Automation", "AI assistant", "Integrations"],
        ar: ["موقع للمنتج", "أتمتة", "مساعد AI", "تكاملات"]
    },
    "Other": {
        en: ["Website", "Automation", "Marketing", "Custom system"],
        ar: ["موقع", "أتمتة", "تسويق", "نظام مخصص"]
    },
    "أخرى": {
        en: ["Website", "Automation", "Marketing", "Custom system"],
        ar: ["موقع", "أتمتة", "تسويق", "نظام مخصص"]
    }
};

function getDict(lang: Lang) {
    if (lang === "ar") {
        return {
            title: "مساعد مبيعات ZIZO",
            reset: "إعادة تعيين",
            step1: "أهلًا 👋 نوع نشاطك إيه؟",
            step2: "تمام. محتاج إيه دلوقتي؟",
            step3: "تمام 👍 اختار أسرع طريقة للتواصل:",
            placeholder: "اكتب هنا...",
            typing: "جاري الكتابة...",
            whatsapp: "واتساب",
            email: "إيميل",
            closed: "تم إنهاء المحادثة",
            other: "أخرى",
            help: "محتاج مساعدة"
        };
    }
    return {
        title: "ZIZO Sales Assistant",
        reset: "Reset chat",
        step1: "Hi 👋 What type of business do you run?",
        step2: "Great. What do you need right now?",
        step3: "Perfect 👍 Choose the fastest way to reach us:",
        placeholder: "Type here...",
        typing: "ZIZO is typing...",
        whatsapp: "WhatsApp",
        email: "Email",
        closed: "Conversation Finished",
        other: "Other",
        help: "I need help"
    };
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const lang: Lang = (locale as Lang) || "en";
    const dict = getDict(lang);

    const [open, setOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [step, setStep] = React.useState<ChatStep>("BUSINESS");
    const [lead, setLead] = React.useState<LeadData>({ conversationId: "" });
    const [options, setOptions] = React.useState<string[]>([]);
    const [input, setInput] = React.useState("");

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Initial session setup - ALWAYS START FRESH ON RELOAD/REMOUNT
    React.useEffect(() => {
        const conversationId = crypto.randomUUID();
        setLead({ conversationId });
        setMessages([{ id: "init", role: "assistant", content: dict.step1 }]);
        setOptions(BIZ_OPTIONS[lang]);
        setStep("BUSINESS");
        setMounted(true);

        // Save locale preference
        localStorage.setItem("zivra_locale", lang);
    }, [locale, lang, dict.step1]);

    // Body scroll lock
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [open]);

    // Auto-scroll
    React.useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, open]);

    const addMsg = (role: Role, content: string, isContactCard: boolean = false) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content, isContactCard }]);
    };

    const handleReset = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const conversationId = crypto.randomUUID();
        setLead({ conversationId });
        setMessages([{ id: crypto.randomUUID(), role: "assistant", content: dict.step1 }]);
        setOptions(BIZ_OPTIONS[lang]);
        setStep("BUSINESS");
        setInput("");
    };

    const logEvent = async (eventName: string, payload: any) => {
        try {
            await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event: eventName, payload: { ...payload, conversationId: lead.conversationId, locale: lang, timestamp: new Date().toISOString(), pageUrl: window.location.href } }),
            });
        } catch (e) {
            console.error("Failed to log event", e);
        }
    };

    const handleOption = (e: React.MouseEvent, opt: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (step === "DONE") return;

        addMsg("user", opt);
        setOptions([]);

        const isHelp = opt === dict.help;

        if (step === "BUSINESS") {
            if (isHelp) {
                setStep("CONTACT");
                setTimeout(() => addMsg("assistant", dict.step3, true), 300);
            } else {
                setLead(prev => ({ ...prev, businessType: opt }));
                setStep("SERVICE");
                const nextOptions = SERVICE_MAPPING[opt]?.[lang] || SERVICE_MAPPING["Other"][lang];
                // Add "I need help" to every service step
                const finalOptions = [...nextOptions, dict.help];
                setTimeout(() => {
                    addMsg("assistant", dict.step2);
                    setOptions(finalOptions);
                }, 300);
            }
        } else if (step === "SERVICE") {
            setLead(prev => ({ ...prev, serviceInterest: opt }));
            setStep("CONTACT");
            setTimeout(() => addMsg("assistant", dict.step3, true), 300);
        }
    };

    const handleCTA = async (e: React.MouseEvent, channel: "whatsapp" | "email") => {
        e.preventDefault();
        e.stopPropagation();

        await logEvent("contact_click", {
            selectedBusiness: lead.businessType,
            selectedService: lead.serviceInterest,
            channel
        });

        setStep("DONE");

        if (channel === "whatsapp") {
            window.open("https://wa.me/358401604442", "_blank");
        } else {
            window.location.href = "mailto:hello@zivra.dev";
        }
    };

    const sendMessage = () => {
        if (!input.trim() || step === "DONE") return;
        const text = input.trim();
        setInput("");
        addMsg("user", text);

        // Manual entry immediately forces contact to avoid AI rambling
        setStep("CONTACT");
        setTimeout(() => addMsg("assistant", dict.step3, true), 600);
    };

    const isRtl = lang === "ar";
    if (!mounted) return null;

    return (
        <>
            <Portal>
                {/* Overlay layer - fixed inset-0 z-[9999] pointer-events-none */}
                <div
                    className={`fixed inset-0 z-[9999] pointer-events-none transition-all duration-300 ${open ? 'visible opacity-100' : 'invisible opacity-0'
                        }`}
                >
                    {/* Modal window - pointer-events-auto */}
                    <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className={`absolute bottom-24 ${isRtl ? 'left-5 md:left-8' : 'right-5 md:right-8'} w-[400px] max-w-[calc(100vw-40px)] h-[600px] flex flex-col rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 bg-black/80 backdrop-blur-3xl pointer-events-auto transition-transform duration-500 ease-out ${open ? 'translate-y-0' : 'translate-y-5'
                            }`}
                        style={{ pointerEvents: open ? 'auto' : 'none' }}
                    >
                        {/* Interactive Area */}
                        <div className="relative z-20 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10">
                                        <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-white tracking-tight leading-none">{dict.title}</h3>
                                        <button
                                            onClick={handleReset}
                                            className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-1 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                            type="button"
                                        >
                                            <RefreshCw size={10} />
                                            {dict.reset}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); setOpen(false); }}
                                    className="h-9 w-9 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
                                    type="button"
                                >
                                    <span className="text-xl">✕</span>
                                </button>
                            </div>

                            {/* Messages History */}
                            <div
                                ref={listRef}
                                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth overscroll-contain"
                            >
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        {m.isContactCard ? (
                                            <div className="w-full max-w-[90%] bg-indigo-600/10 rounded-3xl p-5 border border-indigo-500/30 backdrop-blur-md shadow-2xl">
                                                <p className="text-sm font-bold text-white mb-5 leading-relaxed">{m.content}</p>
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={(e) => handleCTA(e, "whatsapp")}
                                                        type="button"
                                                        className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl p-4 transition-all group"
                                                    >
                                                        <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                            <div className="relative h-6 w-6">
                                                                <Image src="/images/zivra-logo.jpg" alt="" fill className="object-contain" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 text-start">
                                                            <span className="text-sm font-black text-white block uppercase tracking-wide">{dict.whatsapp}</span>
                                                        </div>
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]" />
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleCTA(e, "email")}
                                                        type="button"
                                                        className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl p-4 transition-all group"
                                                    >
                                                        <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                            <div className="relative h-6 w-6">
                                                                <Image src="/images/zivra-logo.jpg" alt="" fill className="object-contain opacity-50" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 text-start">
                                                            <span className="text-sm font-black text-white block uppercase tracking-wide">{dict.email}</span>
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
                            </div>

                            {/* Options & Input */}
                            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent border-t border-white/5">
                                {options.length > 0 && step !== "DONE" && (
                                    <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2">
                                        {options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={(e) => handleOption(e, opt)}
                                                type="button"
                                                className={`rounded-full px-5 py-3 text-xs font-black transition-all border ${opt === dict.help
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                        : 'bg-indigo-500/20 text-white border-indigo-500/30 hover:bg-indigo-600'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {step !== "DONE" ? (
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
                                            onClick={(e) => { e.preventDefault(); sendMessage(); }}
                                            disabled={!input.trim()}
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

                        {/* Stacking Context Safeguard - Bottom decoration */}
                        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-indigo-500/5 to-transparent shadow-inner" aria-hidden="true" />
                    </div>
                </div>
            </Portal>

            {/* Float Trigger */}
            <button
                onClick={(e) => { e.preventDefault(); setOpen(!open); }}
                type="button"
                className="fixed bottom-6 right-6 z-[10000] h-18 w-18 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center group overflow-hidden pointer-events-auto"
            >
                {open ? (
                    <span className="text-2xl font-light">✕</span>
                ) : (
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                        <div className="relative h-[65%] w-[65%] rounded-full overflow-hidden shadow-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                            <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                        </div>
                    </div>
                )}
            </button>
        </>
    );
}