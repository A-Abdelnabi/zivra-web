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
        .slice(-6); // Very short context for speed and focused flow
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);
        const lang = body?.lang === 'ar' ? 'ar' : 'en';
        const step = body?.leadData?.currentStep || 0;

        // =========================
        // ✅ Rule 1: No long loops. Immediate Chip Responses.
        // =========================
        if (body.event) {
            const ev = body.event;
            const val = body.value;

            // Step 0 -> 1 (Business selected)
            if (ev === "business_selected") {
                return NextResponse.json({
                    reply: lang === "ar"
                        ? "تمام. أي خدمة تحتاج نركز عليها؟ أو حاب نختار لك الأنسب؟"
                        : "Got it. Which service should we focus on? Or would you like a recommendation?",
                    options: lang === "ar"
                        ? ["Website / Apps", "AI Chatbot", "Automation", "ساعدوني في الاختيار"]
                        : ["Website / Apps", "AI Chatbot", "Automation", "Help me choose"]
                });
            }

            // Step 1 -> 2 (Service/Consultation selected)
            if (ev === "service_selected") {
                return NextResponse.json({
                    reply: lang === "ar"
                        ? "ممتاز 👍 وش هدفك الأساسي؟ مبيعات أكثر، توفير وقت، أو رد آلي؟"
                        : "Great choice 👍 What is your main goal? More sales, saving time, or automated support?",
                    options: lang === "ar"
                        ? ["زيادة مبيعات", "توفير وقت", "رد آلي", "إطلاق مشروع"]
                        : ["Increase sales", "Save time", "Automated support", "New project"]
                });
            }
        }

        // =========================
        // ✅ Rule 2: AI as a Closer.
        // =========================
        let systemPrompt = "";
        if (lang === "ar") {
            systemPrompt = `
أنت (زيزو - ZIZO)، خبير في ZIVRA. 
مهمتك: مساعدة العميل خلال "خطوة واحدة" فقط لمساعدته على اختيار الخدمة، ثم إغلاق المحادثة وتوجيهه للواتساب.

⚠️ شروط صارمة:
1. ردودك لا تتعدى سطرين.
2. لا تشرح بالتفصيل. اذكر الفائدة النهائية فقط.
3. بمجرد أن يذكر العميل اهتمامه، قل له "هذا تخصصنا، تواصل معنا واتساب عشان نعطيك الخطة المناسبة".
4. المخرجات دائماً JSON.
`;
        } else {
            systemPrompt = `
You are (ZIZO), a sales strategist at ZIVRA.
Objective: Guide the user in ONE turn to clarify their need, then push to WhatsApp to close.

⚠️ Strict Rules:
1. Max 2 short sentences.
2. No long lists. Focus on the outcome/ROI.
3. As soon as the user indicates interest or a problem, say: "We specialize in this. Let's talk on WhatsApp to finalize your plan."
4. Always output JSON.
`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt.trim() + "\n\nJSON Format: {\"reply\": string, \"suggested_options\": string[]}" },
                ...incoming,
            ],
            max_tokens: 150,
        });

        const parsed = JSON.parse(completion.choices?.[0]?.message?.content || "{}");
        const lowerReply = parsed.reply?.toLowerCase() || "";

        // Final State Check
        const isClosing = step >= 2 || lowerReply.includes("whatsapp") || lowerReply.includes("contact") || lowerReply.includes("تواصل") || lowerReply.includes("واتساب");

        return NextResponse.json({
            reply: parsed.reply,
            options: isClosing ? ["__CTA__"] : (parsed.suggested_options || []),
        });

    } catch (error: any) {
        return NextResponse.json({ reply: "Service error. Please contact directly.", options: ["__CTA__"] });
    }
}