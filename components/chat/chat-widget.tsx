"use client";

import * as React from "react";

type Role = "user" | "assistant";

type Msg = {
    id: string;
    role: Role;
    content: string;
};

function detectLang(text: string): "ar" | "en" {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text) ? "ar" : "en";
}

export default function ChatWidget() {
    const [open, setOpen] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [lang, setLang] = React.useState<"ar" | "en">("en");

    const [messages, setMessages] = React.useState<Msg[]>([
        {
            id: "init",
            role: "assistant",
            content:
                "Hi 👋 I’m ZIVRA AI Assistant. What do you need today: Website, Web App, AI Chatbot, or Automation?",
        },
    ]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!open) return;
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, open]);

    function addMsg(role: Role, content: string) {
        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role, content },
        ]);
    }

    function getWhatsAppLink() {
        const phoneNumber = "358401604442"; // بدون 00 وبدون +
        const text =
            lang === "ar"
                ? "مرحبًا ZIVRA! محتاج مساعدة بخصوص موقع/تطبيق/شات بوت/أوتوميشن."
                : "Hi ZIVRA! I want to ask about building a website, app, chatbot, or automation.";
        const message = encodeURIComponent(text);
        return `https://wa.me/${phoneNumber}?text=${message}`;
    }

    async function sendMessage(customText?: string) {
        const text = (customText ?? input).trim();
        if (!text || loading) return;

        const nextLang = detectLang(text);
        setLang(nextLang);

        const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // لو 405 أو 500 أو غيره
                const details =
                    typeof data?.details === "string"
                        ? data.details
                        : typeof data?.error === "string"
                            ? data.error
                            : `Request failed (${res.status})`;

                addMsg(
                    "assistant",
                    nextLang === "ar"
                        ? `⚠️ حصلت مشكلة في الاتصال بالسيرفر: ${details}\nجرّب تعمل Restart للسيرفر (Ctrl+C ثم npm run dev).`
                        : `⚠️ Connection issue: ${details}\nTry restarting the dev server (Ctrl+C then npm run dev).`
                );
                return;
            }

            addMsg(
                "assistant",
                data?.reply ||
                (nextLang === "ar"
                    ? "تمام ✅ قولّي محتاج إيه بالظبط؟"
                    : "Got it ✅ Tell me what you need exactly.")
            );
        } catch {
            addMsg(
                "assistant",
                nextLang === "ar"
                    ? "⚠️ Sorry، حصل خطأ في الاتصال. جرّب تاني أو استخدم WhatsApp."
                    : "⚠️ Sorry, connection error. Please try again or use WhatsApp."
            );
        } finally {
            setLoading(false);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") sendMessage();
    }

    const quick = {
        title: lang === "ar" ? "اختيارات سريعة:" : "Quick options:",
        website: lang === "ar" ? "موقع / لاندنج" : "Website / Landing",
        webapp: lang === "ar" ? "تطبيق / داشبورد" : "Web App / Dashboard",
        chatbot: lang === "ar" ? "شات بوت" : "AI Chatbot",
        automation: lang === "ar" ? "أوتوميشن (n8n)" : "Automation (n8n)",
        choose: lang === "ar" ? "ساعدني أختار" : "Help me choose",
        whatsapp: lang === "ar" ? "واتساب (أسرع)" : "WhatsApp (faster)",
        placeholder: lang === "ar" ? "اكتب رسالتك..." : "Type your message...",
        send: lang === "ar" ? "إرسال" : "Send",
        typing: lang === "ar" ? "يكتب الآن…" : "Typing…",
        enter: lang === "ar" ? "اضغط Enter للإرسال" : "Press Enter to send",
    };

    return (
        <>
            {/* ================= Chat Panel ================= */}
            {open && (
                <div className="fixed bottom-24 right-5 z-[99999] w-[380px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm font-semibold text-white">
                                ZIVRA AI Assistant
                            </span>
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
                                <div className="mr-auto rounded-2xl bg-white/5 px-3 py-2 text-white/50">
                                    {quick.typing}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick options */}
                    <div className="border-t border-white/10 px-4 py-3">
                        <div className="mb-2 text-[11px] text-white/40">{quick.title}</div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => sendMessage("I need a website/landing page. Ask me 1 question to clarify the requirements.")}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {quick.website}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage("I need a web app or dashboard. Ask me 1 question to clarify the requirements.")}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {quick.webapp}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage("I need an AI chatbot for website/WhatsApp. Ask me 1 question to clarify the goal.")}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {quick.chatbot}
                            </button>

                            <button
                                type="button"
                                onClick={() => sendMessage("I want automation with n8n (leads/CRM/WhatsApp). Ask me 1 question to clarify the workflow.")}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {quick.automation}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    sendMessage(
                                        lang === "ar"
                                            ? "أنا محتار. اسألني سؤال واحد يساعدك تختارلي أفضل حل."
                                            : "I’m not sure. Ask me 1 question that helps you choose the best option."
                                    )
                                }
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                            >
                                {quick.choose}
                            </button>

                            {/* WhatsApp opens WhatsApp ONLY */}
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-white hover:bg-green-500/30"
                            >
                                {quick.whatsapp}
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
                                placeholder={quick.placeholder}
                                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading}
                                type="button"
                                className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                            >
                                {quick.send}
                            </button>
                        </div>

                        <div className="mt-2 text-[11px] text-white/40">{quick.enter}</div>
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