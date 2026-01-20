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

type ApiResponse = {
    reply: string;
    options?: string[];
    recommendedPackage?: string | null;
    error?: string;
};

function t(lang: Lang) {
    if (lang === "ar") {
        return {
            welcome: "ZIVRA AI",
            init: "يا هلا 👋 أنا زيزو مساعدك الذكي. عشان أقدر أخدمك صح، وش نوع بزنسك؟",
            title: "خيارات سريعة:",
            initialOptions: [
                "مطعم / كافيه",
                "فندق / سياحة",
                "شركة خدمات",
                "متجر إلكتروني",
                "SaaS / Startup",
                "سوشيال ميديا"
            ],
            whatsapp: "واتساب",
            email: "إيميل",
            placeholder: "اكتب هنا...",
            send: "إرسال",
            typing: "المساعد يكتب...",
            enter: "اضغط Enter للإرسال",
            errServer: (d: string) => `⚠️ مشكلة بالاتصال: ${d}`,
            errConn: "⚠️ خطأ في الاتصال. حاول مرة ثانية.",
            fallback: "تمام، كمل معي.",
            waText: "هلا زيفرا! حاب أستفسر عن الباقات والحلول الذكية لشغلي.",
        };
    }

    return {
        welcome: "ZIVRA AI",
        init: "Hi 👋 I'm ZIZO AI Assistant. To help you best, what type of business are you running?",
        title: "Quick Options:",
        initialOptions: [
            "Restaurant / Café",
            "Hotel / Tourism",
            "Service Business",
            "E-commerce",
            "SaaS / Startup",
            "Social Media"
        ],
        whatsapp: "WhatsApp",
        email: "Email",
        placeholder: "Type your message...",
        send: "Send",
        typing: "ZIZO is typing…",
        enter: "Press Enter to send",
        errServer: (d: string) => `⚠️ Connection issue: ${d}`,
        errConn: "⚠️ Connection error. Please try again.",
        fallback: "Got it, tell me more.",
        waText: "Hi ZIVRA! I'd like to discuss the packages and tech solutions for my business.",
    };
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = React.useState(false);
    const lang: Lang = locale as Lang;

    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<string[]>([]);
    const [messages, setMessages] = React.useState<Msg[]>([]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (open && messages.length === 0) {
            const dict = t(lang);
            setMessages([{ id: "init", role: "assistant", content: dict.init }]);
            setOptions(dict.initialOptions);
        }
    }, [open, lang, messages.length]);

    React.useEffect(() => {
        if (!open) return;
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, open]);

    function addMsg(role: Role, content: string) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content }]);
    }

    function getWhatsAppLink() {
        const phoneNumber = "358401604442";
        const text = t(lang).waText;
        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    }

    async function sendMessage(customText?: string) {
        const text = (customText ?? input).trim();
        if (!text || loading) return;

        const userMsg: Msg = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput("");
        setLoading(true);
        setOptions([]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    lang: lang,
                }),
            });

            const data: ApiResponse = await res.json().catch(() => ({}));

            if (!res.ok) {
                addMsg("assistant", t(lang).errServer("Internal Error"));
                return;
            }

            addMsg("assistant", data.reply || t(lang).fallback);

            // Collect final options
            let finalOptions = data.options || [];

            // If the AI didn't provide WhatsApp/Email as options but seems to be closing, or just generally:
            // Let's ensure WhatsApp and Email are always options if we want to push the sale
            if (finalOptions.length === 0 || nextMessages.length > 4) {
                if (!finalOptions.includes("WhatsApp")) finalOptions.push("WhatsApp");
                if (!finalOptions.includes("Email")) finalOptions.push("Email");
            }

            setOptions(finalOptions);

        } catch {
            addMsg("assistant", t(lang).errConn);
        } finally {
            setLoading(false);
        }
    }

    const isRtl = lang === "ar";

    return (
        <>
            {open && (
                <div
                    dir={isRtl ? "rtl" : "ltr"}
                    className="fixed bottom-24 right-5 z-[99999] w-[400px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl transition-all flex flex-col h-[600px] animate-in slide-in-from-bottom-5 duration-300"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 shrink-0 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
                                <Image
                                    src="/images/zivra-logo.jpg"
                                    alt="Zivra"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-tight">ZIZO Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-medium">{isRtl ? 'متصل الآن' : 'Online Now'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <span className="text-lg">✕</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === "user"
                                            ? "bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/10"
                                            : "bg-white/10 text-white/90 border border-white/5 rounded-tl-sm"
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 text-white/40 text-xs animate-pulse border border-white/5">
                                    {t(lang).typing}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Input */}
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        {/* Dynamic Recommendations */}
                        {options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {options.map((opt) => {
                                    const isWhatsApp = opt === "WhatsApp" || opt === "واتساب";
                                    const isEmail = opt === "Email" || opt === "إيميل";

                                    if (isWhatsApp) {
                                        return (
                                            <a
                                                key={opt}
                                                href={getWhatsAppLink()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 rounded-full bg-green-600/20 px-4 py-2 text-xs font-bold text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-all hover:scale-105"
                                            >
                                                <span className="text-sm">💬</span> {t(lang).whatsapp}
                                            </a>
                                        );
                                    }
                                    if (isEmail) {
                                        return (
                                            <a
                                                key={opt}
                                                href="mailto:info@zivra.co"
                                                className="flex items-center gap-1.5 rounded-full bg-blue-600/20 px-4 py-2 text-xs font-bold text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all hover:scale-105"
                                            >
                                                <span className="text-sm">✉️</span> {t(lang).email}
                                            </a>
                                        );
                                    }
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => sendMessage(opt)}
                                            className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition-all border border-white/10 hover:border-white/20 active:scale-95"
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="relative flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder={t(lang).placeholder}
                                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-primary/50 transition-colors"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                            >
                                <span className={isRtl ? 'rotate-180' : ''}>➤</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Float Trigger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-6 right-6 z-[99999] h-16 w-16 flex items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all duration-300 group"
            >
                {open ? (
                    <span className="text-xl">✕</span>
                ) : (
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-colors">
                        <Image
                            src="/images/zivra-logo.jpg"
                            alt="Chat"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                {/* Notification Badge */}
                {!open && messages.length === 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full border-2 border-[#0a0a0c] flex items-center justify-center text-[10px] font-bold">1</span>
                )}
            </button>
        </>
    );
}