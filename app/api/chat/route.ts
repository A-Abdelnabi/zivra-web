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
        .slice(-4); // Minimal context for maximum speed and focus
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "No API Key" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);
        const lang = body?.lang === 'ar' ? 'ar' : 'en';
        const step = body?.leadData?.currentStep || 0;

        // =========================
        // ✅ Deterministic Funnel
        // =========================
        if (body.event) {
            const val = body.value;

            // Step 0 -> 1 (Identification to Discovery)
            if (body.event === "business_selected") {
                return NextResponse.json({
                    reply: lang === "ar"
                        ? "تمام. أي خدمة بتبدأ فيها؟ عشان نعطيك الخطة المناسبة مباشرة."
                        : "Perfect. Which service do you want to start with? We'll provide the right plan immediately.",
                    options: lang === "ar"
                        ? ["Website / Apps", "AI Chatbot", "Automation", "Lead System", "Social Growth"]
                        : ["Website / Apps", "AI Chatbot", "Automation", "Lead System", "Social Growth"]
                });
            }

            // Step 1 -> 2 (Discovery to Conversion)
            // This is the hard stop turn.
            if (body.event === "service_selected") {
                return NextResponse.json({
                    reply: lang === "ar"
                        ? "ممتاز 👍 هذا تخصصنا في ZIVRA. عشان نعطيك التسعير والجدول الزمني، تواصل معنا واتساب أو إيميل الحين:"
                        : "Great choice 👍 This is exactly what we specialize in at ZIVRA. To give you the pricing and timeline, let's talk via WhatsApp or Email now:",
                    options: ["__CTA__"]
                });
            }
        }

        // =========================
        // ✅ Sales Closer AI (Turn 2 = Dead Stop)
        // =========================
        let systemPrompt = "";
        if (lang === "ar") {
            systemPrompt = `
أنت (زيزو - ZIZO)، خبير مبيعات ZIVRA. 
قاعدة ذهبية: لا تجعل الكلام يطول. 

إذا كانت المحادثة في بدايتها (Step 0): اسأل عن نوع نشاط العميل.
إذا كان العميل يسأل عن تفاصيل (Step 1): أعطه فائدة واحدة فقط ثم اطلب التواصل واتساب فوراً.
بمجرد أن يُبدي العميل أي اهتمام: قل "تواصل معنا واتساب لنبدأ فوراً".

اللغة: Urban Saudi (خليجي أبيض). 
المخرجات: JSON.
`;
        } else {
            systemPrompt = `
You are (ZIZO), the sales architect at ZIVRA. 
Golden Rule: Close the loop. Fast.

If the conversation is just starting (Step 0): Ask for their business type.
If the user asks for details/benefits (Step 1): Provide exactly ONE outcome-focused benefit and push to WhatsApp immediately.
As soon as interest is shown: Say "Let's talk on WhatsApp to finalize your quote."

Output: JSON.
`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt.trim() + "\n\nFormat: {\"reply\": string, \"suggested_options\": string[]}" },
                ...incoming,
            ],
            max_tokens: 150,
        });

        const parsed = JSON.parse(completion.choices?.[0]?.message?.content || "{}");
        const lowerReply = parsed.reply?.toLowerCase() || "";

        // Force conversion if AI tries to drift or if it's the second turn
        const shouldClose = step >= 1 || lowerReply.includes("whatsapp") || lowerReply.includes("contact") || lowerReply.includes("تواصل") || lowerReply.includes("واتساب");

        return NextResponse.json({
            reply: parsed.reply,
            options: shouldClose ? ["__CTA__"] : (parsed.suggested_options || []),
        });

    } catch (error: any) {
        return NextResponse.json({ reply: "Service error. Please contact directly.", options: ["__CTA__"] });
    }
}