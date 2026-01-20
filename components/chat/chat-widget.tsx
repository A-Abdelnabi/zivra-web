"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

type Role = "user" | "assistant";
type Lang = "ar" | "en";

type Msg = {
    id: string;
    role: Role;
    content: string;
};

type LeadData = {
    name?: string;
    email?: string;
    businessType?: string;
    selectedService?: string;
    goal?: string;
};

function t(lang: Lang) {
    if (lang === "ar") {
        return {
            welcome: "ZIVRA AI",
            step0: "هلا 👋 أنا مساعد ZIZO. بس بسألك سؤال سريع وبعدين أعرض لك خدماتنا. وش نوع نشاطك؟",
            step1: "تمام. هذه خدماتنا - اختر اللي يناسبك، أو تواصل معنا ونرتّب لك أفضل خيار.",
            step2: "عشان نعطيك اقتراح مناسب وتسعير سريع، تواصل معنا:\n\n✅ واتساب: https://wa.me/358401604442\n✅ إيميل: hello@zivra.dev\n\nوبالرسالة اكتب:\n1) نوع النشاط\n2) الهدف اللي تبيه\n3) أفضل وقت نتواصل معك",
            consultReq: "إيش المزايا؟ / باقة الأنسب لي؟",
            goalQuestion: "وش أهم هدف لك الحين؟",
            whatsapp: "تواصل عبر واتساب",
            email: "تواصل عبر البريد",
            placeholder: "أكتب استفسارك هنا...",
            typing: "ZIZO يكتب...",
            whatsappLink: "https://wa.me/358401604442",
            emailAddr: "hello@zivra.dev",
            bizTypes: ["مطعم / كافيه", "عيادة / طبي", "فندق / سياحة", "شركة خدمات", "متجر إلكتروني", "Startup / SaaS", "غير متأكد بعد"],
            services: ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth", "ساعدوني في الاختيار"],
            goals: ["زيادة المبيعات", "زيادة العملاء", "توفير الوقت / أتمتة", "تحسين الخدمة", "إطلاق سريع"],
            waTemplate: (biz: string, goal: string) => `هلا ZIVRA! حاب أستفسر عن حلولكم. نشاطي هو ${biz || '...'} وهدفي هو ${goal || '...'} وأفضل وقت للتواصل معي هو...`
        };
    }

    return {
        welcome: "ZIVRA AI",
        step0: "Hi 👋 I’m ZIZO AI Assistant. I’ll ask 1 quick question, then I’ll show you our services. What type of business are you?",
        step1: "Perfect. Here’s what we can help you with. Pick anything, or just contact us and we’ll guide you.",
        step2: "To give you a precise recommendation and a quick quote, please contact us:\n\n✅ WhatsApp: https://wa.me/358401604442\n✅ Email: hello@zivra.dev\n\nWhen you message us, tell us:\n1) Your business type\n2) What you want to achieve\n3) Best time to contact you",
        consultReq: "What are the benefits? / Help me choose.",
        goalQuestion: "What’s your main goal right now?",
        whatsapp: "Contact via WhatsApp",
        email: "Contact via Email",
        placeholder: "Type your message...",
        typing: "ZIZO is typing...",
        whatsappLink: "https://wa.me/358401604442",
        emailAddr: "hello@zivra.dev",
        bizTypes: ["Restaurant / Café", "Clinic / Medical", "Hotel / Tourism", "Service Business", "E-commerce", "Startup / SaaS", "Not sure yet"],
        services: ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth", "Help me choose"],
        goals: ["Increase sales", "Get more leads", "Save time / automate", "Improve support", "Launch fast"],
        waTemplate: (biz: string, goal: string) => `Hi ZIVRA! I'd like to discuss your tech solutions. My business is ${biz || '...'} and my goal is ${goal || '...'} and the best time to reach me is...`
    };
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = React.useState(false);
    const lang: Lang = (locale as Lang) || "en";
    const dict = t(lang);

    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [options, setOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [input, setInput] = React.useState("");

    // Lead state
    const [lead, setLead] = React.useState<LeadData>({});
    const [step, setStep] = React.useState(0);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Persist lead to localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem("zivra_lead_context");
        if (saved) setLead(JSON.parse(saved));
    }, []);

    React.useEffect(() => {
        if (Object.keys(lead).length > 0) {
            localStorage.setItem("zivra_lead_context", JSON.stringify(lead));
        }
    }, [lead]);

    // Initialize flow
    React.useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{ id: "init", role: "assistant", content: dict.step0 }]);
            setOptions(dict.bizTypes);
        }
    }, [open, messages.length, dict]);

    React.useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, open]);

    const addMsg = (role: Role, content: string) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content }]);
    };

    const captureAndSyncLead = async (update: Partial<LeadData>) => {
        const newLead = { ...lead, ...update };
        setLead(newLead);

        // Sync to server via the chat API even without a message to trigger webhook
        try {
            await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [], // Minimal message payload
                    lang,
                    leadData: { ...newLead, locale: lang }
                }),
            });
        } catch (e) {
            console.error("Lead sync error", e);
        }
    };

    const handleOption = async (opt: string) => {
        addMsg("user", opt);
        setOptions([]);

        if (step === 0) {
            // Business Type chosen
            setStep(1);
            await captureAndSyncLead({ businessType: opt });
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                addMsg("assistant", dict.step1);
                setOptions(dict.services);
            }, 600);
        } else if (step === 1) {
            // Service chosen or help me choose
            await captureAndSyncLead({ selectedService: opt });
            if (opt.includes("choose") || opt.includes("اختيار")) {
                handleAskConsultation();
            } else {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    addMsg("assistant", dict.step2);
                    setOptions(["WhatsApp 💬", "Email ✉️", dict.consultReq]);
                }, 600);
            }
        } else if (step === 2 || opt === dict.consultReq) {
            if (opt.includes("WhatsApp")) {
                window.open(`https://wa.me/358401604442?text=${encodeURIComponent(dict.waTemplate(lead.businessType || '', lead.goal || ''))}`, "_blank");
                captureAndSyncLead({ lastUserMessage: "Clicked WhatsApp CTA" });
            } else if (opt.includes("Email")) {
                window.location.href = `mailto:hello@zivra.dev?subject=Project Inquiry&body=${encodeURIComponent(dict.waTemplate(lead.businessType || '', lead.goal || ''))}`;
                captureAndSyncLead({ lastUserMessage: "Clicked Email CTA" });
            } else {
                handleAskConsultation();
            }
        } else if (step === 3) {
            // Goal chosen
            await captureAndSyncLead({ goal: opt });
            sendMessage(opt); // Send to AI for the 4-6 bullet tailored explanation
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
        if (!text || loading) return;

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
                    leadData: { ...lead, locale: lang }
                }),
            });

            const data = await res.json();
            if (res.ok) {
                addMsg("assistant", data.reply);
                setOptions(data.options || ["WhatsApp 💬", "Email ✉️"]);
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
                <div dir={isRtl ? "rtl" : "ltr"} className="fixed bottom-24 right-5 z-[9999] w-[400px] max-w-[calc(100vw-40px)] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl flex flex-col h-[600px] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
                                <Image src="/images/zivra-logo.jpg" alt="Zivra" fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">ZIZO Assistant</h3>
                                <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-medium tracking-wider uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    {isRtl ? 'متصل الآن' : 'Online Now'}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">✕</button>
                    </div>

                    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow-sm ${m.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-white/10 text-white/90 rounded-tl-sm border border-white/5"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-xs text-white/30 italic px-2">{dict.typing}</div>}
                    </div>

                    <div className="p-4 bg-white/5 border-t border-white/10">
                        {options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOption(opt)}
                                        className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-primary hover:scale-105 transition-all border border-white/10"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder={dict.placeholder}
                                className="flex-1 h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-primary/50 outline-none"
                            />
                            <button onClick={() => sendMessage()} disabled={loading} className="h-11 w-11 flex items-center justify-center rounded-xl bg-primary text-white transition-transform active:scale-95">➤</button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-[9999] h-16 w-16 rounded-full bg-primary text-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
            >
                {open ? <span className="text-xl">✕</span> : (
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-white/20">
                        <Image src="/images/zivra-logo.jpg" alt="Chat" fill className="object-cover" />
                    </div>
                )}
                {!open && messages.length === 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full border-2 border-[#0a0a0c] flex items-center justify-center text-[10px] font-bold">1</span>
                )}
            </button>
        </>
    );
}