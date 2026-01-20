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
        .filter(
            (m) =>
                m &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string"
        )
        .map((m) => ({ role: m.role as Role, content: String(m.content) }))
        .slice(-10);
}

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

        if (body.leadData) {
            const lastMsg = incoming.length > 0 ? incoming[incoming.length - 1].content.toLowerCase() : "";
            await sendLead({
                ...body.leadData,
                lastUserMessage: body.leadData.lastUserMessage || lastMsg,
                timestamp: new Date().toISOString(),
                lang: lang,
                source: "ZIVRA Website Chat"
            });
            if (incoming.length === 0) {
                return NextResponse.json({ success: true });
            }
        }

        // =========================
        // ✅ Strict Event Navigation
        // =========================
        if (body.event) {
            const ev = body.event;
            const val = body.value;

            if (ev === "business_selected") {
                return NextResponse.json({
                    reply: lang === "ar"
                        ? "تمام. هذه خدماتنا - اختر اللي تبدأ فيه، أو حاب نساعدك تختار الأنسب لنشاطك؟"
                        : "Perfect. Here are our main services - pick one to start with, or would you like us to help you choose?",
                    options: lang === "ar"
                        ? ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth", "ساعدوني في الاختيار"]
                        : ["Website / Landing Page", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Follow-up", "Social Media Growth", "Help me choose"]
                });
            }

            if (ev === "service_selected") {
                const isConsultation = val.includes("choose") || val.includes("اختيار") || val.includes("benefits") || val.includes("المزايا");
                if (isConsultation) {
                    return NextResponse.json({
                        reply: lang === "ar" ? "وش أهم هدف تبي تحققه الحين؟" : "What is your primary goal right now?",
                        options: lang === "ar"
                            ? ["زيادة مبيعات", "توفير وقت / أتمتة", "خدمة عملاء رد آلي", "إطلاق مشروع جديد"]
                            : ["Increase sales", "Save time / Automate", "Automated support", "Launch new project"]
                    });
                } else {
                    // This case is handled in frontend now (direct CTA), but fallback here
                    return NextResponse.json({
                        reply: lang === "ar"
                            ? "تمام 👍 أسرع طريقة نخدمك بشكل مضبوط هي إنك تتواصل معنا مباشرة.\nاختَر اللي يناسبك:"
                            : "Perfect 👍 The fastest way to help you properly is to get contacted directly.\nPlease choose what works best for you:",
                        options: ["__CTA__"]
                    });
                }
            }

            if (ev === "goal_selected") {
                return NextResponse.json({
                    reply: lang === "ar"
                        ? "تمام 👍 أسرع طريقة نخدمك بشكل مضبوط هي إنك تتواصل معنا مباشرة.\nاختَر اللي يناسبك:"
                        : "Perfect 👍 The fastest way to help you properly is to get contacted directly.\nPlease choose what works best for you:",
                    options: ["__CTA__"]
                });
            }
        }

        // =========================
        // ✅ ZIZO AI (Concise Sales Assistant)
        // =========================
        let systemPrompt = "";
        if (lang === "ar") {
            systemPrompt = `
أنت (زيزو - ZIZO)، خبير في ZIVRA.
هدفك: تحويل الزوار لعملاء عبر الواتساب بأسرع وقت.
اللغة: خليجي/سعودي أبيض (Urban Saudi). قصير جداً ومباشر.
لا تكرر الكلام. بمجرد ما يفهم العميل الخدمة، وجهه واتساب.

الخدمات: Website, Web App, AI Chatbot, Automation (n8n), Lead Follow-up, Social Growth.

إذا سأل العميل "وش تقدمون" أو "وش الفوائد":
1. اعط فوائد قوية (3-4 نقاط).
2. انته دائماً بطلب التواصل واتساب.

رابط الواتساب: https://wa.me/358401604442
`;
        } else {
            systemPrompt = `
You are (ZIZO), a sales architect at ZIVRA.
Goal: Convert visitors to WhatsApp leads ASAP.
Tone: Professional SaaS expert, very concise, outcome-focused.
Do not provide long explanations. Once the value is clear, push to WhatsApp.

Services: Website, Web App, AI Chatbot, Automation (n8n), Lead Follow-up, Social Growth.

If visitor asks "what do you do" or "benefits":
1. Provide 3-4 punchy outcome-driven bullets.
2. Always end with a WhatsApp contact offer.

WhatsApp: https://wa.me/358401604442
`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt.trim() + "\n\nOutput JSON: {\"reply\": string, \"suggested_options\": string[]}" },
                ...incoming,
            ],
            max_tokens: 300,
        });

        const parsed = JSON.parse(completion.choices?.[0]?.message?.content || "{}");
        // Force CTA if intent is clear
        const lowerReply = parsed.reply?.toLowerCase() || "";
        const needsCTA = lowerReply.includes("wa.me") || lowerReply.includes("contact") || lowerReply.includes("تواصل") || lowerReply.includes("واتساب");

        return NextResponse.json({
            reply: parsed.reply,
            options: needsCTA ? ["__CTA__"] : (parsed.suggested_options || []),
        });

    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json({ error: "AI error" }, { status: 500 });
    }
}