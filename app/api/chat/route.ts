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
        .map((m) => ({ role: m.role as Role, content: String(m.content) }))
        .slice(-2); // Extreme context limit for speed
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);
        const lang = body?.lang === 'ar' ? 'ar' : 'en';

        // Sales Closer Prompt: Extremely direct.
        const systemPrompt = lang === 'ar'
            ? "أنت ZIZO، مساعد مبيعات في ZIVRA. مهمتك تحويل العميل للواتساب. ردك يجب أن يكون سطر واحد فقط: 'هذا تخصصنا. تواصل معنا واتساب فوراً لنبدأ العمل'."
            : "You are ZIZO, a sales closer at ZIVRA. Your only job is to push the user to WhatsApp. Your response must be exactly one sentence: 'This is our specialty. Let's talk on WhatsApp immediately to get started.'";

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            messages: [
                { role: "system", content: systemPrompt },
                ...incoming,
            ],
            max_tokens: 50,
        });

        const reply = completion.choices?.[0]?.message?.content || "";

        return NextResponse.json({ reply });

    } catch (error: any) {
        return NextResponse.json({ reply: "Service error. Please use WhatsApp." });
    }
}