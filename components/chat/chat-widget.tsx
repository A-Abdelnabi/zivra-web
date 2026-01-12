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
            init: "أهلًا 👋 أنا مساعد ZIVRA. محتاج إيه النهارده؟ (موقع / تطبيق / شات بوت / أوتوميشن)",
            title: "اختيارات سريعة:",
            website: "موقع / لاندنج",
            webapp: "تطبيق / داشبورد",
            chatbot: "شات بوت",
            automation: "أوتوميشن (n8n)",
            choose: "ساعدني أختار",
            whatsapp: "واتساب (أسرع)",
            placeholder: "اكتب رسالتك...",
            send: "إرسال",
            typing: "يكتب الآن…",
            enter: "اضغط Enter للإرسال",
            errServer: (d: string) =>
                `⚠️ حصلت مشكلة في الاتصال بالسيرفر: ${d}\nجرّب تعمل Restart للسيرفر (Ctrl+C ثم npm run dev).`,
            errConn: "⚠️ حصل خطأ في الاتصال. جرّب تاني أو استخدم WhatsApp.",
            fallback: "تمام ✅ قولّي محتاج إيه بالظبط؟",
            waText: "مرحبًا ZIVRA! محتاج مساعدة بخصوص موقع/تطبيق/شات بوت/أوتوميشن.",
            quickWebsite: "أنا محتاج موقع/لاندنج. اسألني سؤال واحد يوضح المطلوب.",
            quickWebApp: "أنا محتاج تطبيق/داشبورد. اسألني سؤال واحد يوضح المطلوب.",
            quickChatbot: "أنا محتاج شات بوت للموقع/واتساب. اسألني سؤال واحد يوضح الهدف.",
            quickAutomation: "أنا محتاج أوتوميشن (ليدز/CRM/واتساب). اسألني سؤال واحد يوضح الفلو.",
            quickChoose: "أنا محتار. اسألني سؤال واحد يساعدك تختارلي أفضل حل.",
        };
    }

    if (lang === "fi") {
        return {
            init: "Hei 👋 Olen ZIVRA AI -avustaja. Mitä tarvitset tänään: verkkosivut, web-sovellus, chatbot vai automaatio?",
            title: "Pikavalinnat:",
            website: "Verkkosivut / Landing",
            webapp: "Web-app / Dashboard",
            chatbot: "AI Chatbot",
            automation: "Automaatio (n8n)",
            choose: "Auta valitsemaan",
            whatsapp: "WhatsApp (nopeampi)",
            placeholder: "Kirjoita viestisi...",
            send: "Lähetä",
            typing: "Kirjoittaa…",
            enter: "Paina Enter lähettääksesi",
            errServer: (d: string) =>
                `⚠️ Yhteysvirhe palvelimeen: ${d}\nKokeile käynnistää dev-serveri uudelleen (Ctrl+C sitten npm run dev).`,
            errConn: "⚠️ Yhteysvirhe. Kokeile uudelleen tai käytä WhatsAppia.",
            fallback: "Selvä ✅ Kerro tarkemmin mitä tarvitset?",
            waText: "Hei ZIVRA! Haluaisin kysyä verkkosivuista, sovelluksesta, chatbotista tai automaatiosta.",
            quickWebsite: "Tarvitsen verkkosivun/landing-sivun. Kysy 1 selventävä kysymys.",
            quickWebApp: "Tarvitsen web-sovelluksen/dashboardin. Kysy 1 selventävä kysymys.",
            quickChatbot: "Tarvitsen chatbotin verkkosivulle/WhatsAppiin. Kysy 1 selventävä kysymys.",
            quickAutomation: "Haluan automaation (liidit/CRM/WhatsApp). Kysy 1 selventävä kysymys.",
            quickChoose: "En ole varma. Kysy 1 kysymys ja ehdota paras vaihtoehto.",
        };
    }

    // English
    return {
        init: "Hi 👋 I’m ZIVRA AI Assistant. What do you need today: Website, Web App, AI Chatbot, or Automation?",
        title: "Quick options:",
        website: "Website / Landing",
        webapp: "Web App / Dashboard",
        chatbot: "AI Chatbot",
        automation: "Automation (n8n)",
        choose: "Help me choose",
        whatsapp: "WhatsApp (faster)",
        placeholder: "Type your message...",
        send: "Send",
        typing: "Typing…",
        enter: "Press Enter to send",
        errServer: (d: string) =>
            `⚠️ Connection issue: ${d}\nTry restarting the dev server (Ctrl+C then npm run dev).`,
        errConn: "⚠️ Sorry, connection error. Please try again or use WhatsApp.",
        fallback: "Got it ✅ Tell me what you need exactly.",
        waText: "Hi ZIVRA! I want to ask about building a website, app, chatbot, or automation.",
        quickWebsite: "I need a website/landing page. Ask me 1 question to clarify the requirements.",
        quickWebApp: "I need a web app or dashboard. Ask me 1 question to clarify the requirements.",
        quickChatbot: "I need an AI chatbot for website/WhatsApp. Ask me 1 question to clarify the goal.",
        quickAutomation: "I want automation with n8n (leads/CRM/WhatsApp). Ask me 1 question to clarify the workflow.",
        quickChoose: "I’m not sure. Ask me 1 question that helps you choose the best option.",
    };
}

export default function ChatWidget() {
    const [open, setOpen] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    // ✅ 3 languages
    const [lang, setLang] = React.useState<Lang>("en");

    // ✅ init text depends on lang (we update it on mount)
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
        const phoneNumber = "358401604442"; // بدون 00 وبدون +
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
                                onClick={() => sendMessage(ui.quickWebsite)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.website}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.quickWebApp)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.webapp}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.quickChatbot)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.chatbot}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.quickAutomation)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.automation}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage(ui.quickChoose)}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {ui.choose}
                            </button>

                            {/* WhatsApp */}
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-white hover:bg-green-500/30"
                            >
                                {ui.whatsapp}
                            </a>
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

                        <div className="mt-2 text-[11px] text-white/40">{ui.enter}</div>
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