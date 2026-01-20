"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { MessageCircle, Mail, Send } from "lucide-react";
import Portal from "@/components/ui/Portal";

type Role = "user" | "assistant";
type Lang = "ar" | "en";

type Msg = {
    id: string;
    role: Role;
    content: string;
    isContactCard?: boolean;
};

// Conversational State Machine
// 0: Initial (Business Type)
// 1: Service/Goal Selection
// 2: Recommendation (Final before CTA)
// 3: CONVERTED (Force CTA, No more messages)
type ChatStep = 0 | 1 | 2 | 3;

type LeadData = {
    businessType?: string;
    selectedService?: string;
    goal?: string;
    step?: number;
};

function t(lang: Lang) {
    if (lang === "ar") {
        return {
            welcome: "ZIZO AI",
            step0: "هلا 👋 أنا مساعد ZIZO. وش نوع نشاطك التجاري؟",
            placeholder: "أدخل استفسارك هنا...",
            typing: "جاري المعالجة...",
            bizTypes: ["مطعم / كافيه", "عيادة / طبي", "فندق / سياحة", "شركة خدمات", "متجر إلكتروني", "Startup / SaaS"],
            ctaText: "تمام 👍 أسرع طريقة نخدمك بشكل مضبوط هي إنك تتواصل معنا مباشرة.\nاختَر اللي يناسبك:",
            whatsapp: "واتساب",
            email: "إيميل",
            contactNow: "تواصل الآن"
        };
    }

    return {
        welcome: "ZIZO AI",
        step0: "Hi 👋 I’m ZIZO. What type of business do you run?",
        placeholder: "Type your query...",
        typing: "ZIZO is thinking...",
        bizTypes: ["Restaurant / Café", "Clinic / Medical", "Hotel / Tourism", "Service Business", "E-commerce", "Startup / SaaS"],
        ctaText: "Perfect 👍 The fastest way to help you properly is to get contacted directly.\nPlease choose what works best for you:",
        whatsapp: "WhatsApp",
        email: "Email",
        contactNow: "Contact Now"
    };
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const lang: Lang = (locale as Lang) || "en";
    const dict = t(lang);

    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [options, setOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [input, setInput] = React.useState("");

    const [lead, setLead] = React.useState<LeadData>({});
    const [step, setStep] = React.useState<ChatStep>(0);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Initial hydration and state recovery
    React.useEffect(() => {
        setMounted(true);
        const savedLead = localStorage.getItem("zv_chat_lead");
        const savedMessages = localStorage.getItem("zv_chat_msgs");
        const savedStep = localStorage.getItem("zv_chat_step");

        if (savedLead) setLead(JSON.parse(savedLead));
        if (savedMessages) setMessages(JSON.parse(savedMessages));
        if (savedStep) setStep(parseInt(savedStep) as ChatStep);
    }, []);

    // Body scroll lock
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [open]);

    // Persistence
    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem("zv_chat_lead", JSON.stringify(lead));
            localStorage.setItem("zv_chat_msgs", JSON.stringify(messages));
            localStorage.setItem("zv_chat_step", step.toString());
        }
    }, [lead, messages, step, mounted]);

    // Initial State Trigger
    React.useEffect(() => {
        if (mounted && messages.length === 0) {
            setMessages([{ id: "init", role: "assistant", content: dict.step0 }]);
            setOptions(dict.bizTypes);
        }
    }, [mounted, messages.length, dict]);

    // Auto-scroll
    React.useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, open, loading]);

    const addMsg = (role: Role, content: string, isContactCard: boolean = false) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content, isContactCard }]);
    };

    const forceConversion = (reason?: string) => {
        setStep(3);
        setOptions([]);
        setLoading(false);
        addMsg("assistant", reason || dict.ctaText, true);
    };

    const sendToAPI = async (eventName: string, value: string, updateLead: Partial<LeadData>) => {
        const newLead = { ...lead, ...updateLead };
        setLead(newLead);
        setLoading(true);
        setOptions([]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                    lang,
                    event: eventName,
                    value: value,
                    leadData: { ...newLead, currentStep: step }
                }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.options?.includes("__CTA__") || step >= 2) {
                    forceConversion(data.reply);
                } else {
                    addMsg("assistant", data.reply);
                    setOptions(data.options || []);
                }
            } else {
                forceConversion();
            }
        } catch (e) {
            forceConversion();
        } finally {
            setLoading(false);
        }
    };

    const handleOption = async (opt: string) => {
        if (step === 3 || loading) return;
        addMsg("user", opt);

        if (step === 0) {
            setStep(1);
            await sendToAPI("business_selected", opt, { businessType: opt });
        } else if (step === 1) {
            setStep(2);
            await sendToAPI("service_selected", opt, { selectedService: opt });
        } else if (step === 2) {
            forceConversion();
        }
    };

    const handleCTA = (method: "whatsapp" | "email") => {
        if (method === "whatsapp") {
            window.open("https://wa.me/358401604442", "_blank");
        } else {
            window.location.href = "mailto:hello@zivra.dev";
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || step === 3 || loading) return;
        const text = input.trim();
        setInput("");
        addMsg("user", text);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: text }].map(m => ({ role: m.role, content: m.content })),
                    lang,
                    leadData: { ...lead }
                }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.options?.includes("__CTA__") || step >= 2) {
                    forceConversion(data.reply);
                } else {
                    addMsg("assistant", data.reply);
                    setOptions(data.options || []);
                }
            } else {
                forceConversion();
            }
        } catch (e) {
            forceConversion();
        } finally {
            setLoading(false);
        }
    };

    const isRtl = lang === "ar";
    if (!mounted) return null;

    return (
        <>
            <Portal>
                {/* Overlay Container */}
                <div className={`fixed inset-0 z-[9999] pointer-events-none ${open ? 'visible' : 'invisible'}`}>

                    {/* The Modal */}
                    <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className={`absolute bottom-24 right-5 md:right-8 w-[400px] max-w-[calc(100vw-40px)] h-[600px] transition-all duration-500 ease-out flex flex-col rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/80 backdrop-blur-3xl 
                            ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5 pointer-events-auto">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-indigo-500/20">
                                    <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-tight">ZIZO Assistant</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                        {isRtl ? 'نشط الآن' : 'Active Now'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>

                        {/* Messages History */}
                        <div
                            ref={listRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth overscroll-contain pointer-events-auto"
                        >
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    {m.isContactCard ? (
                                        <div className="w-full max-w-[90%] bg-indigo-600/5 rounded-3xl p-5 border border-indigo-500/20 backdrop-blur-md shadow-lg">
                                            <p className="text-sm font-medium text-white/90 mb-6 leading-relaxed whitespace-pre-line">{m.content}</p>
                                            <div className="space-y-3">
                                                <button
                                                    onPointerDown={() => handleCTA("whatsapp")}
                                                    className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl p-4 transition-all group"
                                                >
                                                    <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 relative">
                                                        <Image src="/images/zivra-logo.jpg" alt="" fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 text-start">
                                                        <span className="text-sm font-bold text-white block">{dict.whatsapp}</span>
                                                        <span className="text-[10px] text-white/30 uppercase tracking-widest leading-none">Instant Message</span>
                                                    </div>
                                                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                                </button>

                                                <button
                                                    onPointerDown={() => handleCTA("email")}
                                                    className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-2xl p-4 transition-all group"
                                                >
                                                    <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 relative">
                                                        <Image src="/images/zivra-logo.jpg" alt="" fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 text-start">
                                                        <span className="text-sm font-bold text-white block">{dict.email}</span>
                                                        <span className="text-[10px] text-white/30 uppercase tracking-widest leading-none">Official Inquiry</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${m.role === "user"
                                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none shadow-indigo-500/20 shadow-lg"
                                                : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md"
                                            }`}>
                                            {m.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl px-4 py-2 text-indigo-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                                        {dict.typing}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Footer */}
                        <div className="p-6 bg-gradient-to-t from-black/60 to-transparent border-t border-white/5 pointer-events-auto">
                            {options.length > 0 && step < 3 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {options.map((opt) => (
                                        <button
                                            key={opt}
                                            onPointerDown={() => handleOption(opt)}
                                            className="rounded-full bg-indigo-500/10 px-5 py-2.5 text-xs font-semibold text-white/80 hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95 transition-all border border-indigo-500/20 active:bg-indigo-700"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step < 3 ? (
                                <div className="relative flex items-center gap-3">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder={dict.placeholder}
                                        className="flex-1 h-12 rounded-2xl border border-white/5 bg-white/5 px-5 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/50 outline-none transition-all"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={loading || !input.trim()}
                                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-30"
                                    >
                                        <Send size={18} className={isRtl ? 'rotate-180' : ''} />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-12 flex items-center justify-center rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-[10px] uppercase tracking-widest font-bold text-indigo-300 pointer-events-none opacity-60">
                                    Conversation Closed • Use CTA above
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Portal>

            {/* Float Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-[10000] h-18 w-18 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center group overflow-hidden"
            >
                {open ? (
                    <span className="text-2xl font-light">✕</span>
                ) : (
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                        <div className="relative h-[70%] w-[70%] rounded-full overflow-hidden border-2 border-white/20">
                            <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                        </div>
                    </div>
                )}
            </button>
        </>
    );
}