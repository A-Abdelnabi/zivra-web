"use client";

import * as React from "react";

type Role = "user" | "assistant";
type Lang = "ar" | "en" | "fi";

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

function detectLang(text: string): Lang {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    if (arabicRegex.test(text)) return "ar";

    // Finnish hints
    const fiRegex = /[äöå]/i;
    const fiWords =
        /\b(hei|moi|kiitos|tarvitsen|haluan|sivusto|verkkosivu|yhteys|paketit|hinta|tarjous|apua)\b/i;
    if (fiRegex.test(text) || fiWords.test(text)) return "fi";

    return "en";
}

function initialLangFromBrowser(): Lang {
    const nav = (typeof navigator !== "undefined" ? navigator.language : "en").toLowerCase();
    if (nav.startsWith("fi")) return "fi";
    if (nav.startsWith("ar")) return "ar";
    return "en";
}

function t(lang: Lang) {
    if (lang === "ar") {
        return {
            // Gulf-neutral / Professional / Short
            init: "مرحبًا 👋 أنا مساعد ZIZO الذكي. أقدر أساعدك نفهم مشروعك ونرشّح لك الحل الأنسب. وش نوع مشروعك؟",
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

    if (lang === "fi") {
        return {
            init: "Hei 👋 Olen ZIZO AI -avustaja. Kysyn pari nopeaa kysymystä ymmärtääkseni liiketoimintaasi paremmin. Minkä tyyppistä liiketoimintaa pyörität?",
            title: "Valitse toimiala:",
            initialOptions: [
                "Ravintola / Kahvila",
                "Hotelli / Matkailu",
                "Palveluyritys",
                "Verkkokauppa",
                "SaaS / Startup",
                "En ole varma"
            ],
            whatsapp: "WhatsApp",
            placeholder: "Kirjoita viestisi...",
            send: "Lähetä",
            typing: "Kirjoittaa…",
            enter: "Paina Enter lähettääksesi",
            errServer: (d: string) => `⚠️ Palvelinvirhe: ${d}`,
            errConn: "⚠️ Yhteysvirhe. Kokeile uudelleen.",
            fallback: "Selvä, kerro lisää.",
            waText: "Hei ZIVRA! Haluaisin keskustella teknologiaratkaisuista.",
        };
    }

    // English
    return {
        init: "Hi 👋 I’m ZIZO AI Assistant. I’ll ask you a couple of quick questions to understand your business and give you a useful direction. What type of business are you running?",
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
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [lang, setLang] = React.useState<Lang>("en");

    // Dynamic options state (initially null until set by lang/effect)
    const [options, setOptions] = React.useState<string[]>([]);

    const [messages, setMessages] = React.useState<Msg[]>([
        { id: "init", role: "assistant", content: "…" },
    ]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Initialize Language & Options
    React.useEffect(() => {
        const l = initialLangFromBrowser();
        setLang(l);
        const dict = t(l);
        setMessages([{ id: "init", role: "assistant", content: dict.init }]);
        setOptions(dict.initialOptions);
    }, []);

    // Scroll to bottom
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
        const message = encodeURIComponent(text);
        return `https://wa.me/${phoneNumber}?text=${message}`;
    }

    async function sendMessage(customText?: string) {
        const text = (customText ?? input).trim();
        if (!text || loading) return;

        // Detect language switch from user input if they type manually
        if (!customText) {
            const nextLang = detectLang(text);
            if (nextLang !== lang) {
                setLang(nextLang);
            }
        }

        const userMsg: Msg = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput("");
        setLoading(true);
        // Clear options while waiting for AI to give new ones
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
                }),
            });

            const data: ApiResponse = await res.json().catch(() => ({}));

            if (!res.ok) {
                const details = data.details || data.error || `Error (${res.status})`;
                addMsg("assistant", t(lang).errServer(details));
                return;
            }

            // 1. Add AI Response
            const replyText = data.reply || t(lang).fallback;
            addMsg("assistant", replyText);

            // 2. Update Options if provided by API, otherwise keep empty (user has to type)
            // If the API returns options, we show them.
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

    const ui = t(lang);
    const isRtl = lang === "ar";

    return (
        <>
            {/* ================= Chat Panel ================= */}
            {open && (
                <div
                    dir={isRtl ? "rtl" : "ltr"}
                    className="fixed bottom-24 right-5 z-[99999] w-[380px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl transition-all"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm font-semibold text-white">ZIVRA AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                            aria-label="Close chat"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={listRef} className="h-72 overflow-y-auto px-4 py-3 text-sm">
                        <div className="flex flex-col gap-2">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={
                                        m.role === "user"
                                            ? "max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-white self-end text-start whitespace-pre-wrap"
                                            : "max-w-[85%] rounded-2xl bg-white/5 px-3 py-2 text-white/90 self-start text-start whitespace-pre-wrap"
                                    }
                                >
                                    {m.content}
                                </div>
                            ))}

                            {loading && (
                                <div className="max-w-[85%] rounded-2xl bg-white/5 px-3 py-2 text-white/50 self-start">
                                    {ui.typing}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick options (Dynamic) */}
                    <div className="border-t border-white/10 px-4 py-3 bg-white/5">
                        {options.length > 0 && (
                            <div className="mb-2 text-[11px] text-white/40">{ui.title}</div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {options.map((opt) => {
                                // Smart Rendering for Final CTA Buttons
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
                    </div>

                    {/* Input */}
                    <div className="border-t border-white/10 p-3">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder={ui.placeholder}
                                className={`flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 ${isRtl ? "text-right" : "text-left"}`}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading}
                                type="button"
                                className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                            >
                                {isRtl ? <span className="rotate-180 block">➤</span> : <span>➤</span>}
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
                            <span>{ui.enter}</span>
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-green-400"
                            >
                                {ui.whatsapp}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= Floating Button ================= */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-5 right-5 z-[99999] grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white shadow-xl hover:opacity-95 transition-transform hover:scale-105"
                aria-label={open ? "Close chat" : "Open chat"}
                type="button"
            >
                <span className="text-xl">{open ? "✕" : "💬"}</span>
            </button>
        </>
    );
}