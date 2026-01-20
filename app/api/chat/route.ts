import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type Role = "system" | "user" | "assistant";
type Msg = { role: Role; content: string };

function normalizeMessages(incoming: any): Msg[] {
    const arr = Array.isArray(incoming) ? incoming : [];
    return arr
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({ role: m.role as Role, content: m.content as string }))
        .slice(-3); // Minimal context for speed
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        // 1. Handle Lead Events (Bypass AI)
        if (body.event) {
            console.log(`[ZIZO_CHAT_EVENT] ${body.event}`, body.payload);

            // If it's a contact click, log heavily as a conversion
            if (body.event === "contact_click") {
                // Here we could sync to a CRM, Sheets, or Webhook
                console.log("💰 CONVERSION TRIGGERED:", body.payload);
            }

            return NextResponse.json({ ok: true, status: "event_logged" });
        }

        // 2. Handle Free-text Messages (OpenAI)
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        const incoming = normalizeMessages(body?.messages);
        const lang = body?.lang === 'ar' ? 'ar' : 'en';

        const systemPrompt = lang === 'ar'
            ? "أنت (ZIZO)، مساعد مبيعات في ZIVRA. ردودك يجب أن تكون قصيرة جداً (سطر واحد). بمجرد أن يذكر العميل أي اهتمام، أخبره أن يتواصل معنا واتساب فوراً."
            : "You are (ZIZO), a sales assistant at ZIVRA. Keep responses extremely short (max 1 sentence). As soon as the user shows interest, tell them to contact us on WhatsApp immediately.";

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                { role: "system", content: systemPrompt },
                ...incoming,
            ],
            max_tokens: 100,
        });

        const reply = completion.choices?.[0]?.message?.content || "";

        return NextResponse.json({
            reply,
            // AI responses in this mode always trigger the terminal contact card if they imply contact
            options: ["__FORCE_CONTACT__"]
        });

    } catch (error: any) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Service error" }, { status: 500 });
    }
}