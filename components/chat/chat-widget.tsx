"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { MessageCircle, Mail } from "lucide-react";

type Role = "user" | "assistant";
type Lang = "ar" | "en";

type Msg = {
    id: string;
    role: Role;
    content: string;
    isContactCard?: boolean;
};

type LeadData = {
    businessType?: string;
    selectedService?: string;
    goal?: string;
    lastUserMessage?: string;
};

function t(lang: Lang) {
    if (lang === "ar") {
        return {
            welcome: "ZIZO AI",
            step0: "هلا 👋 أنا مساعد ZIZO. بس بسألك سؤال سريع وبعدين أعرض لك خدماتنا. وش نوع نشاطك؟",
            step1: "تمام. هذه خدماتنا - اختر اللي يناسبك، أو تواصل معنا ونرتّب لك أفضل خيار.",
            step2Title: "تمام 👍 اختر الأنسب لك:",
            goalQuestion: "وش أهم هدف لك الحين؟",
            placeholder: "أكتب استفسارك هنا...",
            typing: "ZIZO يكتب...",
            bizTypes: ["مطعم / كافيه", "عيادة / طبي", "فندق / سياحة", "شركة خدمات", "متجر إلكتروني", "Startup / SaaS", "غير متأكد بعد"],
            services: ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth Engine", "ساعدوني في الاختيار"],
            goals: ["زيادة المبيعات", "زيادة العملاء", "توفير الوقت / أتمتة", "تحسين الخدمة", "إطلاق سريع"],
            consultReq: "إيش المزايا؟",
            whatsapp: "واتساب",
            email: "إيميل"
        };
    }

    return {
        welcome: "ZIZO AI",
        step0: "Hi 👋 I’m ZIZO AI Assistant. I’ll ask 1 quick question, then I’ll show you our services. What type of business are you?",
        step1: "Perfect. Here’s what we can help you with. Pick anything, or just contact us and we’ll guide you.",
        step2Title: "Perfect 👍 Choose what works best for you:",
        goalQuestion: "What’s your main goal right now?",
        placeholder: "Type your message...",
        typing: "ZIZO is typing...",
        bizTypes: ["Restaurant / Café", "Clinic / Medical", "Hotel / Tourism", "Service Business", "E-commerce", "Startup / SaaS", "Not sure yet"],
        services: ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth Engine", "Help me choose"],
        goals: ["Increase sales", "Get more leads", "Save time / automate", "Improve support", "Launch fast"],
        consultReq: "What are the benefits?",
        whatsapp: "WhatsApp",
        email: "Email"
    };
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = React.useState(false);
    const [converted, setConverted] = React.useState(false);
    const lang: Lang = (locale as Lang) || "en";
    const dict = t(lang);

    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [options, setOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [input, setInput] = React.useState("");

    const [lead, setLead] = React.useState<LeadData>({});
    const [step, setStep] = React.useState(0);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const saved = localStorage.getItem("zivra_lead_context");
        if (saved) setLead(JSON.parse(saved));

        const isConv = localStorage.getItem("zivra_converted");
        if (isConv === "true") setConverted(true);
    }, []);

    React.useEffect(() => {
        if (Object.keys(lead).length > 0) {
            localStorage.setItem("zivra_lead_context", JSON.stringify(lead));
        }
    }, [lead]);

    React.useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{ id: "init", role: "assistant", content: dict.step0 }]);
            setOptions(dict.bizTypes);
        }
    }, [open, messages.length, dict]);

    React.useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, open]);

    const addMsg = (role: Role, content: string, isContactCard: boolean = false) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content, isContactCard }]);
    };

    const syncLead = async (update: Partial<LeadData>, type: string = "lead_update") => {
        const newLead = { ...lead, ...update };
        setLead(newLead);

        try {
            await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [],
                    lang,
                    leadData: {
                        ...newLead,
                        type,
                        timestamp: new Date().toISOString(),
                        pageUrl: typeof window !== "undefined" ? window.location.href : ""
                    }
                }),
            });
        } catch (e) { /* silent */ }
    };

    const handleCTA = async (method: "whatsapp" | "email") => {
        if (converted) return;

        setConverted(true);
        localStorage.setItem("zivra_converted", "true");

        await syncLead({ lastUserMessage: `Clicked ${method} CTA FINAL` }, "contact_click_final");

        if (method === "whatsapp") {
            window.open("https://wa.me/358401604442", "_blank");
        } else {
            window.location.href = "mailto:hello@zivra.dev";
        }
    };

    const handleOption = async (opt: string) => {
        if (converted) return;

        addMsg("user", opt);
        setOptions([]);

        if (step === 0) {
            setStep(1);
            await syncLead({ businessType: opt });
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                addMsg("assistant", dict.step1);
                setOptions(dict.services);
            }, 600);
        } else if (step === 1) {
            await syncLead({ selectedService: opt });
            if (opt.includes("choose") || opt.includes("اختيار") || opt.includes("المزايا") || opt.includes("benefits")) {
                handleAskConsultation();
            } else {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    // Single bubble card for final CTA
                    addMsg("assistant", dict.step2Title, true);
                    setOptions([]);
                }, 600);
            }
        } else if (step === 3) {
            await syncLead({ goal: opt });
            sendMessage(opt);
        }
    };

    const handleAskConsultation = () => {
        setStep(3);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            addMsg("assistant", dict.goalQuestion);
            setOptions(dict.goals);
        }, 600);
    };

    const sendMessage = async (override?: string) => {
        const text = (override ?? input).trim();
        if (!text || loading || converted) return;

        if (!override) addMsg("user", text);
        setInput("");
        setLoading(true);
        setOptions([]);

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
                addMsg("assistant", data.reply);
                // After AI explanation, force CTA card
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    addMsg("assistant", dict.step2Title, true);
                }, 1000);
            }
        } catch (e) {
            addMsg("assistant", lang === 'ar' ? 'عفواً، واجهت مشكلة.' : 'Sorry, something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const isRtl = lang === "ar";

    return (
        <>
            {open && (
                <div dir={isRtl ? "rtl" : "ltr"} className="fixed bottom-24 right-5 z-[9999] w-[400px] max-w-[calc(100vw-40px)] rounded-3xl border border-white/10 bg-black/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-[600px] animate-in slide-in-from-bottom-5 duration-500 ease-out overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="relative h-11 w-11 rounded-full overflow-hidden border border-white/10 ring-2 ring-indigo-500/20">
                                <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white tracking-tight">ZIZO Assistant</h3>
                                <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                    {isRtl ? 'نشط الآن' : 'Active Now'}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all">
                            <span className="text-lg">✕</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                                {m.isContactCard ? (
                                    <div className="w-full max-w-[85%] bg-white/10 rounded-2xl p-5 border border-white/5 backdrop-blur-md shadow-lg">
                                        <p className="text-sm font-semibold text-white/90 mb-4">{m.content}</p>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleCTA("whatsapp")}
                                                className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all group"
                                            >
                                                <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0 relative">
                                                    <Image src="/images/zivra-logo.jpg" alt="" fill className="object-cover" />
                                                </div>
                                                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                                                    {dict.whatsapp}
                                                </span>
                                                <div className="ms-auto h-2 w-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>

                                            <button
                                                onClick={() => handleCTA("email")}
                                                className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all group"
                                            >
                                                <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0 relative">
                                                    <Image src="/images/zivra-logo.jpg" alt="" fill className="object-cover" />
                                                </div>
                                                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                                                    {dict.email}
                                                </span>
                                                <div className="ms-auto h-2 w-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${m.role === "user"
                                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none"
                                            : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md"
                                        }`}>
                                        {m.content}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-2 text-indigo-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                                    {dict.typing}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interactive Footer */}
                    <div className="p-6 bg-gradient-to-b from-transparent to-black/40 border-t border-white/5">
                        {options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOption(opt)}
                                        className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-white/80 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:scale-105 transition-all border border-white/10 active:scale-95"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!converted && (
                            <div className="relative flex items-center gap-3">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder={dict.placeholder}
                                    className="flex-1 h-12 rounded-2xl border border-white/5 bg-white/5 px-5 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/50 outline-none transition-all focus:bg-white/10"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale"
                                >
                                    <span className={`text-lg transition-transform ${isRtl ? 'rotate-180' : ''}`}>➤</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Float Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-[9999] h-18 w-18 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_10px_40px_rgba(99,102,241,0.4)] hover:scale-110 hover:shadow-[0_15px_50px_rgba(99,102,241,0.6)] active:scale-90 transition-all duration-500 flex items-center justify-center group overflow-hidden"
            >
                {open ? (
                    <span className="text-2xl font-light">✕</span>
                ) : (
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                        <div className="relative h-[70%] w-[70%] rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/50 transition-all">
                            <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                        </div>
                    </div>
                )}
                {!open && messages.length === 0 && !converted && (
                    <span className="absolute top-2 right-2 h-4 w-4 bg-red-500 rounded-full border-2 border-black animate-bounce" />
                )}
            </button>
        </>
    );
}