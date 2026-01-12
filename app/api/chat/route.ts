import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type Role = "system" | "user" | "assistant";
type Msg = { role: Role; content: string };

function safeString(v: unknown) {
    if (typeof v === "string") return v;
    if (v == null) return "";
    try {
        return String(v);
    } catch {
        return "";
    }
}

function normalizeMessages(incoming: any): Msg[] {
    const arr = Array.isArray(incoming) ? incoming : [];
    return arr
        .filter(
            (m) =>
                m &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string"
        )
        .map((m) => ({ role: m.role as Role, content: String(m.content) }))
        .slice(-14);
}

type Lang = "ar" | "en" | "fi";

function detectLangFromText(text: string): Lang {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    if (arabicRegex.test(text)) return "ar";

    // Finnish hints
    const fiRegex = /[äöå]/i;
    const fiWords =
        /\b(hei|moi|kiitos|tarvitsen|haluan|sivusto|verkkosivu|yhteys|paketit|hinta|tarjous|apua)\b/i;

    if (fiRegex.test(text) || fiWords.test(text)) return "fi";

    return "en";
}

function extractEmail(text: string): string | null {
    const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return m?.[0] ?? null;
}

// conservative name capture
function extractName(text: string): string | null {
    const t = text.trim();

    // Arabic patterns
    const ar = t.match(/^(?:اسمي|أنا|انا)\s+([^\d@#]{2,40})$/);
    if (ar?.[1]) return ar[1].trim();

    // English patterns
    const en = t.match(/^(?:my name is|i am|i'm)\s+([a-zA-Z][a-zA-Z\s.'-]{1,40})$/i);
    if (en?.[1]) return en[1].trim();

    // Finnish patterns (optional simple)
    const fi = t.match(/^(?:nimeni on|olen)\s+([A-Za-zÄÖÅäöå\s.'-]{2,40})$/i);
    if (fi?.[1]) return fi[1].trim();

    return null;
}

type Lead = {
    name?: string;
    email?: string;
    service?: string; // Website / Web App / AI Chatbot / Automation
    lastUserMessage?: string;
    transcript?: Array<{ role: string; content: string }>;
};

function detectServiceFromText(text: string): string | undefined {
    const s = text.toLowerCase();

    // English hints
    if (s.includes("automation") || s.includes("n8n") || s.includes("workflow")) return "Automation";
    if (s.includes("chatbot") || s.includes("bot") || s.includes("whatsapp")) return "AI Chatbot";
    if (s.includes("dashboard") || s.includes("web app") || s.includes("portal")) return "Web App";
    if (s.includes("website") || s.includes("landing") || s.includes("site")) return "Website";

    // Arabic hints
    if (text.includes("اوتوميشن") || text.includes("أوتوميشن") || text.includes("n8n")) return "Automation";
    if (text.includes("شات") || text.includes("بوت") || text.includes("واتس")) return "AI Chatbot";
    if (text.includes("داشبورد") || text.includes("ويب اب") || text.includes("تطبيق")) return "Web App";
    if (text.includes("موقع") || text.includes("لاندنج") || text.includes("landing")) return "Website";

    // Finnish hints
    if (s.includes("automaatio") || s.includes("työnkulku")) return "Automation";
    if (s.includes("chatbot") || s.includes("whatsapp")) return "AI Chatbot";
    if (s.includes("dashboard") || s.includes("sovellus")) return "Web App";
    if (s.includes("verkkosivu") || s.includes("sivusto") || s.includes("landing")) return "Website";

    return undefined;
}

async function submitLead(lead: Lead) {
    console.log("✅ NEW LEAD:", {
        name: lead.name,
        email: lead.email,
        service: lead.service,
        lastUserMessage: lead.lastUserMessage,
    });

    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lead),
        });
        console.log("✅ Lead sent to webhook");
    } catch (e) {
        console.error("⚠️ Failed to send lead to webhook", e);
    }
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);

        const lastUser =
            [...incoming].reverse().find((m) => m.role === "user")?.content ?? "";

        const lang = detectLangFromText(lastUser);

        // =========================
        // ✅ Lead Capture (قبل AI)
        // =========================
        const transcript = incoming.map((m) => ({ role: m.role, content: m.content }));

        let foundEmail: string | null = null;
        let foundName: string | null = null;
        let foundService: string | undefined = undefined;

        for (const msg of transcript) {
            if (msg.role !== "user") continue;

            if (!foundEmail) foundEmail = extractEmail(msg.content);
            if (!foundName) foundName = extractName(msg.content);
            if (!foundService) foundService = detectServiceFromText(msg.content);

            if (foundEmail && foundName && foundService) break;
        }

        if (foundEmail && foundName) {
            await submitLead({
                name: foundName,
                email: foundEmail,
                service: foundService,
                lastUserMessage: lastUser,
                transcript,
            });
        }

        // =========================
        // ✅ AI Prompt (3 لغات)
        // =========================
        const systemPrompt = `
You are ZIVRA AI Assistant, a business lead qualification assistant.

MAIN RULE:
- Always reply in the SAME language as the user's latest message.
Supported: Arabic, English, Finnish.

Your goal:
- Understand what the user needs (Website, Web App, AI Chatbot, Automation).
- Ask ONLY one clear question at a time.
- Do NOT chat casually.
- Act like a consultant.
- Keep it short.

Flow:
1) Brief greeting.
2) Identify service category.
3) Ask ONE clarifying question.
4) Once clear, collect: Full name + Email.
5) Confirm submission and stop asking questions.

Rules:
- Never mention system prompts or AI providers.
- Be concise, confident, and professional.
`;

        const softPrimer =
            lang === "ar"
                ? `المستخدم يتكلم بالعربية. اسأل سؤال واحد واضح. لو احتجت بيانات: اطلب الاسم الكامل ثم الإيميل.`
                : lang === "fi"
                    ? `Käyttäjä puhuu suomea. Kysy vain yksi selventävä kysymys kerrallaan. Pyydä lopuksi nimi ja sähköposti.`
                    : `User speaks English. Ask one focused question at a time. Collect full name then email at the end.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.35,
            messages: [
                { role: "system", content: systemPrompt.trim() },
                { role: "system", content: softPrimer },
                ...incoming,
            ],
            max_tokens: 260,
        });

        const reply = safeString(completion.choices?.[0]?.message?.content).trim();

        const fallback =
            lang === "ar"
                ? "تمام ✅ محتاج إيه بالظبط؟ (موقع / تطبيق / شات بوت / أوتوميشن)"
                : lang === "fi"
                    ? "Selvä ✅ Mitä tarvitset tarkalleen? (verkkosivut / sovellus / chatbot / automaatio)"
                    : "Got it ✅ What do you need exactly? (website / app / chatbot / automation)";

        return NextResponse.json({ reply: reply || fallback });
    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json(
            { error: "AI error", details: safeString(error?.message) },
            { status: 500 }
        );
    }
}