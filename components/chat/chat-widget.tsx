"use client";

import * as React from "react";

type Role = "user" | "assistant";
type Lang = "ar" | "en" | "fi";

type Msg = {
    id: string;
    role: Role;
    content: string;
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
            init: "أهلاً 👋 أنا مساعد ZIZO. سأسألك بعض الأسئلة السريعة لفهم نشاطك وتوجيهك بشكل صحيح. ما هو نوع نشاطك التجاري؟",
            title: "نوع العمل:",
            opts: {
                rest: "مطعم / كافيه",
                hotel: "فندق / سياحة",
                service: "خدمات / شركة",
                saas: "SaaS / شركة ناشئة",
                ecom: "تجارية إلكترونية",
                notsure: "لست متأكدًا بعد",
            },
            whatsapp: "واتساب",
            placeholder: "اكتب رسالتك...",
            send: "إرسال",
            typing: "يكتب الآن…",
            enter: "اضغط Enter للإرسال",
            errServer: (d: string) =>
                `⚠️ مشكلة في الاتصال: ${d}`,
            errConn: "⚠️ خطأ في الاتصال. حاول مرة أخرى.",
            fallback: "تمام، أخبرني المزيد.",
            waText: "مرحبًا ZIVRA! أريد استشارة بخصوص الحلول التقنية.",
        };
    }

    if (lang === "fi") {
        return {
            init: "Hei 👋 Olen ZIZO AI -avustaja. Kysyn pari nopeaa kysymystä ymmärtääkseni liiketoimintaasi paremmin. Minkä tyyppistä liiketoimintaa pyörität?",
            title: "Valitse toimiala:",
            opts: {
                rest: "Ravintola / Kahvila",
                hotel: "Hotelli / Matkailu",
                service: "Palveluyritys",
                saas: "SaaS / Startup",
                ecom: "Verkkokauppa",
                notsure: "En ole varma",
            },
            whatsapp: "WhatsApp",
            placeholder: "Kirjoita viestisi...",
            send: "Lähetä",
            typing: "Kirjoittaa…",
            enter: "Paina Enter lähettääksesi",
            errServer: (d: string) =>
                `⚠️ Palvelinvirhe: ${d}`,
            errConn: "⚠️ Yhteysvirhe. Kokeile uudelleen.",
            fallback: "Selvä, kerro lisää.",
            waText: "Hei ZIVRA! Haluaisin keskustella teknologiaratkaisuista.",
        };
    }

    // English
    return {
        init: "Hi 👋 I’m ZIZO AI Assistant. I’ll ask you a couple of quick questions to understand your business and give you a useful direction. What type of business are you running?",
        title: "Business Type:",
        opts: {
            rest: "Restaurant / Café",
            hotel: "Hotel / Tourism",
            service: "Service Business",
            saas: "SaaS / Startup",
            ecom: "E-commerce",
            notsure: "Not sure yet",
        },
        whatsapp: "WhatsApp",
        placeholder: "Type your message...",
        send: "Send",
        typing: "Typing…",
        enter: "Press Enter to send",
        errServer: (d: string) =>
            `⚠️ Connection issue: ${d}`,
        errConn: "⚠️ Connection error. Please try again.",
        fallback: "Got it, tell me more.",
        waText: "Hi ZIVRA! I'd like to discuss tech solutions for my business.",
    };
}

export default function ChatWidget() {
    const [open, setOpen] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    // ✅ 3 languages
    const [lang, setLang] = React.useState<Lang>("en");

    const [messages, setMessages] = React.useState<Msg[]>([
        {
            id: "init",
            role: "assistant",
            content: "…",
        },
    ]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    // ✅ set default language from browser once
    React.useEffect(() => {
        const l = initialLangFromBrowser();
        setLang(l);
        setMessages([
            {
                id: "init",
                role: "assistant",
                content: t(l).init,
            },
        ]);
    }, []);

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

        // ✅ detect language from user text
        const nextLang = detectLang(text);
        setLang(nextLang);

        const userMsg: Msg = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        // ✅ avoid stale state
        const nextMessages = [...messages, userMsg];

        setMessages(nextMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // only role/content to API
                    messages: nextMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const details =
                    typeof data?.details === "string"
                        ? data.details
                        : typeof data?.error === "string"
                            ? data.error
                            : `Request failed (${res.status})`;

                addMsg("assistant", t(nextLang).errServer(details));
                return;
            }

            addMsg("assistant", (typeof data?.reply === "string" && data.reply.trim()) || t(nextLang).fallback);
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

    return (
        <>
            {/* ================= Chat Panel ================= */}
            {open && (
                <div className="fixed bottom-24 right-5 z-[99999] w-[380px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl">
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
                                            ? "ml-auto max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-white"
                                            : "mr-auto max-w-[85%] rounded-2xl bg-white/5 px-3 py-2 text-white/90"
                                    }
                                >
                                    {m.content}
                                </div>
                            ))}

                            {loading && (
                                <div className="mr-auto rounded-2xl bg-white/5 px-3 py-2 text-white/50">{ui.typing}</div>
                            )}
                        </div>
                    </div>

                    {/* Quick options */}
                    <div className="border-t border-white/10 px-4 py-3">
                        <div className="mb-2 text-[11px] text-white/40">{ui.title}</div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => sendMessage(ui.opts.rest)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.opts.rest}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.opts.hotel)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.opts.hotel}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.opts.service)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.opts.service}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.opts.saas)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.opts.saas}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.opts.ecom)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.opts.ecom}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.opts.notsure)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.opts.notsure}
                            </button>
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
                                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading}
                                type="button"
                                className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                            >
                                {ui.send}
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
                className="fixed bottom-5 right-5 z-[99999] grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white shadow-xl hover:opacity-95"
                aria-label={open ? "Close chat" : "Open chat"}
                type="button"
            >
                <span className="text-xl">{open ? "✕" : "💬"}</span>
            </button>
        </>
    );
}