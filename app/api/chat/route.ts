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
        .slice(-15);
}

// Helper to send lead to webhook
async function sendLead(data: any) {
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error("Lead webhook error:", e);
    }
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);
        const lang = body?.lang === 'ar' ? 'ar' : 'en';

        // Lead capture logic if data is present
        if (body.leadData) {
            const lastMsg = incoming.length > 0 ? incoming[incoming.length - 1].content.toLowerCase() : "";
            await sendLead({
                ...body.leadData,
                lastUserMessage: body.leadData.lastUserMessage || lastMsg,
                timestamp: new Date().toISOString(),
                lang: lang,
                source: "ZIVRA Website Chat"
            });

            // If it's ONLY a lead sync (no messages), return early
            if (incoming.length === 0) {
                return NextResponse.json({ success: true, message: "Lead captured" });
            }
        }

        // =========================
        // ✅ Event-Based Navigation (Bypass AI)
        // =========================
        if (body.event) {
            const ev = body.event;
            const val = body.value;

            if (ev === "business_selected") {
                return NextResponse.json({
                    reply: lang === "ar" ? "تمام. هذه خدماتنا - اختر اللي يناسبك، أو تواصل معنا ونرتّب لك أفضل خيار." : "Perfect. Here’s what we can help you with. Pick anything, or just contact us and we’ll guide you.",
                    options: lang === "ar"
                        ? ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth Engine", "ساعدوني في الاختيار"]
                        : ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth Engine", "Help me choose"]
                });
            }

            if (ev === "service_selected") {
                const isConsultation = val.includes("choose") || val.includes("اختيار") || val.includes("benefits") || val.includes("المزايا");
                if (isConsultation) {
                    return NextResponse.json({
                        reply: lang === "ar" ? "وش أهم هدف لك الحين؟" : "What’s your main goal right now?",
                        options: lang === "ar"
                            ? ["زيادة المبيعات", "زيادة العملاء", "توفير الوقت / أتمتة", "تحسين الخدمة", "إطلاق سريع"]
                            : ["Increase sales", "Get more leads", "Save time / automate", "Improve support", "Launch fast"]
                    });
                } else {
                    return NextResponse.json({
                        reply: lang === "ar" ? "تمام 👍 اختر الأنسب لك:" : "Perfect 👍 Choose what works best for you:",
                        options: ["__CTA__"] // Flag for contact card
                    });
                }
            }

            // Fallback for events we don't handle directly
            if (incoming.length === 0) {
                return NextResponse.json({ success: true });
            }
        }

        // Extract last message to check for consultation triggers
        const lastMsg = incoming.length > 0 ? incoming[incoming.length - 1].content.toLowerCase() : "";
        const isConsultationTrigger = /benefit|offer|which package|help me choose|package|pricing|details|افضل|باقة|عرض|فوائد|ساعدني|وش تقدمون/.test(lastMsg);

        // =========================
        // ✅ ZIZO AI System Prompt (Sales Engine & Conversion Flow)
        // =========================
        let systemPrompt = "";

        if (lang === "ar") {
            systemPrompt = `
أنت (زيزو - ZIZO)، المهندس التقني وخبير المبيعات في ZIVRA.
هدفك: تحويل الزوار إلى عملاء فعليين عبر الواتساب أو الإيميل بأسرع وقت.

⚠️ قواعد صارمة:
1. اللغة: خليجي/سعودي أبيض (Urban Saudi). لا تستخدم فصحى ولا ترجمة حرفية.
2. الاختصار: ردودك لازم تكون قصيرة جداً ومباشرة.
3. التوجيه: انتهِ دائماً بدعوة للتواصل عبر واتساب أو إيميل.
4. الاستشارة: إذا سأل العميل عن الفوائد أو "وش الأنسب لي"، اسأل سؤال واحد فقط عن هدفه (زيادة مبيعات، أتمتة، الخ) ثم اعطِ إجابة في 4-6 نقاط (bullets) كحد أقصى.

الخدمات التي نقدمها:
- Website / Landing Page
- Web App / Dashboard
- AI Chatbot (دعم فني ومبيعات)
- Automation (n8n) لربط الأنظمة
- Lead Follow-up (واتساب + CRM)
- Social Media Growth Engine

إذا اختار العميل خدمة معينة، اشرحها في 3 نقاط مع اقتراح الباقة المناسبة للبداية.

الختام دائماً:
"عشان نعطيك اقتراح مناسب وتسعير سريع، تواصل معنا:
✅ واتساب: https://wa.me/358401604442
✅ إيميل: hello@zivra.dev"

المخرجات (JSON):
{
  "reply": "الرد النصي",
  "suggested_options": ["خيار1", "خيار2"],
  "data": { "intent": "consultation|direct", "goal": "..." }
}
`;
        } else {
            systemPrompt = `
You are (ZIZO), the tech lead & sales architect at ZIVRA.
Goal: Convert visitors into leads via WhatsApp or Email as fast as possible.

⚠️ Strict Rules:
1. Tone: Professional, confident, high-end SaaS expert.
2. Conciseness: Keep messages extremely short and punchy.
3. CTA: Always end with a WhatsApp/Email contact trigger.
4. Consultation: If asked about benefits or "which package", ask exactly ONE clarifying question about their goal, then provide 4-6 concise bullets max.

Our Services:
- Website / Landing Page
- Web App / Dashboard
- AI Chatbot (Support & Sales)
- Automation (n8n) for connecting tools
- Lead Follow-up System (WhatsApp + CRM)
- Social Media Growth Engine

If a user selects a specific service, explain it in 3 bullets + suggested starting package.

Always end with:
"To give you a precise recommendation and a quick quote, please contact us:
✅ WhatsApp: https://wa.me/358401604442
✅ Email: hello@zivra.dev"

Output Format (JSON):
{
  "reply": "string",
  "suggested_options": ["Option1", "Option2"],
  "data": { "intent": "consultation|direct", "goal": "..." }
}
`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt.trim() },
                ...incoming,
            ],
            max_tokens: 600,
        });

        const content = completion.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);

        return NextResponse.json({
            reply: parsed.reply,
            options: parsed.suggested_options || [],
            data: parsed.data || {}
        });

    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json({ error: "AI error" }, { status: 500 });
    }
}