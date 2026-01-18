"use client";

import * as React from "react";
import Image from "next/image";

type Role = "user" | "assistant";
type Lang = "ar" | "en";

type Msg = {
    id: string;
    role: Role;
    content: string;
};

// Response from the API
type ApiResponse = {
    reply: string;
    options?: string[]; // Dynamic options provided by AI
    leadCaptured?: boolean;
    error?: string;
    details?: string;
};

function t(lang: Lang) {
    if (lang === "ar") {
        return {
            welcome: "مرحبًا بك في ZIVRA",
            selectLang: "اختر لغتك للمتابعة",
            init: "مرحبًا 👋 أنا مساعد ZIZO الذكي. عشان أساعدك صح، وش نوع مشروعك؟",
            title: "خيارات سريعة:",
            // Initial Business Types
            initialOptions: [
                "مطعم / كافيه",
                "فندق / سياحة",
                "شركة خدمات",
                "متجر إلكتروني",
                "SaaS / Startup",
                "غير متأكد بعد"
            ],
            whatsapp: "واتساب",
            placeholder: "اكتب هنا...",
            send: "إرسال",
            typing: "جاري الكتابة...",
            enter: "اضغط Enter للإرسال",
            errServer: (d: string) => `⚠️ مشكلة بالاتصال: ${d}`,
            errConn: "⚠️ خطأ في الاتصال. تأكد من النت وحاول مرة ثانية.",
            fallback: "تمام، كمل معي.",
            waText: "هلا زيفرا! أبي أستفسر عن الحلول الذكية لمشروعي.",
        };
    }

    // English (Default)
    return {
        welcome: "Welcome to ZIVRA",
        selectLang: "Select your language to continue",
        init: "Hi 👋 I’m ZIZO AI Assistant. To help you best, what type of business are you running?",
        title: "Quick Options:",
        initialOptions: [
            "Restaurant / Café",
            "Hotel / Tourism",
            "Service Business",
            "E-commerce",
            "SaaS / Startup",
            "Not sure yet"
        ],
        whatsapp: "WhatsApp",
        placeholder: "Type your message...",
        send: "Send",
        typing: "Typing…",
        enter: "Press Enter to send",
        errServer: (d: string) => `⚠️ Connection issue: ${d}`,
        errConn: "⚠️ Connection error. Please try again.",
        fallback: "Got it, tell me more.",
        waText: "Hi ZIVRA! I'd like to discuss tech solutions for my business.",
    };
}

export default function ChatWidget() {
    const [open, setOpen] = React.useState(false);
    const [lang, setLang] = React.useState<Lang | null>(null);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<string[]>([]);

    // Messages state
    const [messages, setMessages] = React.useState<Msg[]>([]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Initialize/Reset Chat Flow
    const startChat = React.useCallback((selectedLang: Lang) => {
        setLang(selectedLang);
        const dict = t(selectedLang);
        setMessages([{ id: "init", role: "assistant", content: dict.init }]);
        setOptions(dict.initialOptions);
        setLoading(false);
    }, []);

    // Reset Language Selection
    const resetChat = React.useCallback(() => {
        setLang(null);
        setMessages([]);
        setOptions([]);
        setInput("");
        setLoading(false);
    }, []);

    // Scroll to bottom
    React.useEffect(() => {
        if (!open) return;
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, open, lang]); // Added lang dependency to scroll on switch

    function addMsg(role: Role, content: string) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content }]);
    }

    function getWhatsAppLink() {
        // Safe default if lang not selected, though unlikely here
        const currentLang = lang || "en";
        const phoneNumber = "358401604442";
        const text = t(currentLang).waText;
        const message = encodeURIComponent(text);
        return `https://wa.me/${phoneNumber}?text=${message}`;
    }

    async function sendMessage(customText?: string) {
        if (!lang) return; // Guard clause

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
                    lang: lang, // STRICT LANGUAGE PASSING
                }),
            });

            const data: ApiResponse = await res.json().catch(() => ({}));

            if (!res.ok) {
                const details = data.details || data.error || `Error (${res.status})`;
                addMsg("assistant", t(lang).errServer(details));
                return;
            }

            const replyText = data.reply || t(lang).fallback;
            addMsg("assistant", replyText);

            if (data.options && Array.isArray(data.options) && data.options.length > 0) {
                setOptions(data.options);
            } else {
                setOptions([]);
            }

        } catch {
            addMsg("assistant", t(lang).errConn);
        } finally {
            setLoading(false);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") sendMessage();
    }

    const isRtl = lang === "ar";
    // If no lang selected yet, UI defaults to LTR for the selection screen usually
    const currentDir = lang === "ar" ? "rtl" : "ltr";

    return (
        <>
            {/* ================= Chat Panel ================= */}
            {open && (
                <div
                    dir={currentDir}
                    className="fixed bottom-24 right-5 z-[99999] w-[380px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl transition-all flex flex-col h-[500px]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 shrink-0 bg-black/50">
                        <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 border border-white/10">
                                <Image
                                    src="/images/zivra-logo.jpg"
                                    alt="Agent"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-sm font-semibold text-white">ZIVRA AI</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Language Switcher in Header */}
                            {lang && (
                                <button
                                    onClick={resetChat}
                                    className="text-[10px] font-bold text-white/60 hover:text-white border border-white/10 rounded px-2 py-1 uppercase tracking-wider transition-colors"
                                    title="Switch Language"
                                >
                                    {lang === 'en' ? 'AR' : 'EN'}
                                </button>
                            )}

                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                                aria-label="Close chat"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    {!lang ? (
                        // ============ Language Selection Screen ============
                        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-white">Welcome / مرحبًا</h3>
                                <p className="text-white/50 text-sm">Please select your language<br />اختر لغتك للمتابعة</p>
                            </div>

                            <div className="grid grid-cols-1 w-full gap-4">
                                <button
                                    onClick={() => startChat('en')}
                                    className="group relative flex items-center justify-between w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                                >
                                    <span className="text-lg font-medium text-white group-hover:text-primary transition-colors">English</span>
                                    <span className="text-2xl">🇬🇧</span>
                                </button>

                                <button
                                    onClick={() => startChat('ar')}
                                    className="group relative flex items-center justify-between w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                                >
                                    <span className="text-lg font-medium text-white group-hover:text-primary transition-colors">العربية</span>
                                    <span className="text-2xl">🇸🇦</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // ============ Conversation Screen ============
                        <>
                            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 text-sm scroll-smooth">
                                <div className="flex flex-col gap-2 min-h-full justify-start">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={
                                                m.role === "user"
                                                    ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/20 border border-primary/20 px-3 py-2 text-white self-end text-start whitespace-pre-wrap animate-in slide-in-from-right-2 duration-300"
                                                    : "max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 border border-white/5 px-3 py-2 text-white/90 self-start text-start whitespace-pre-wrap animate-in slide-in-from-left-2 duration-300"
                                            }
                                        >
                                            {m.content}
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="max-w-[85%] rounded-2xl bg-white/5 px-3 py-2 text-white/50 self-start animate-pulse">
                                            {t(lang).typing}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick options (Dynamic) */}
                            <div className="shrink-0 border-t border-white/10 px-4 py-3 bg-black/40">
                                {options.length > 0 && (
                                    <div className="mb-2 text-[11px] text-white/40">{t(lang).title}</div>
                                )}

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {options.map((opt) => {
                                        if (opt === "WhatsApp") {
                                            return (
                                                <a
                                                    key={opt}
                                                    href={getWhatsAppLink()}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
                                                >
                                                    {opt}
                                                </a>
                                            )
                                        }
                                        if (opt === "Email") {
                                            return (
                                                <a
                                                    key={opt}
                                                    href="mailto:info@zivra.co"
                                                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15 transition-colors"
                                                >
                                                    {opt}
                                                </a>
                                            )
                                        }
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => sendMessage(opt)}
                                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15 transition-colors"
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Input */}
                                <div className="flex gap-2">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={onKeyDown}
                                        placeholder={t(lang).placeholder}
                                        className={`flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20 transition-colors ${isRtl ? "text-right" : "text-left"}`}
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={loading}
                                        type="button"
                                        className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                                    >
                                        {isRtl ? <span className="rotate-180 block">➤</span> : <span>➤</span>}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ================= Floating Button ================= */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-5 right-5 z-[99999] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                aria-label={open ? "Close chat" : "Open chat"}
                type="button"
            >
                <span className="text-xl flex items-center justify-center w-full h-full">
                    {open ? (
                        "✕"
                    ) : (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                                src="/images/zivra-logo.jpg"
                                alt="Chat"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </span>
            </button>
        </>
    );
}