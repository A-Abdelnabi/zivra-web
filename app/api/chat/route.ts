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
        .slice(-12); // Keep context reasonable
}

type Lang = "ar" | "en" | "fi";

function detectLangFromText(text: string): Lang {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    if (arabicRegex.test(text)) return "ar";

    const fiRegex = /[äöå]/i;
    const fiWords =
        /\b(hei|moi|kiitos|tarvitsen|haluan|sivusto|verkkosivu|yhteys|paketit|hinta|tarjous|apua)\b/i;

    if (fiRegex.test(text) || fiWords.test(text)) return "fi";

    return "en";
}

type Lead = {
    name?: string;
    email?: string;
    businessType?: string;
    goal?: string;
    painPoint?: string;
    service?: string; // Derived or generic
    lastUserMessage?: string;
    transcript?: Array<{ role: string; content: string }>;
    lang?: string;
    source?: string;
};

async function submitLead(lead: Lead) {
    // Only log leads that have at least some business intent captured
    if (!lead.businessType && !lead.goal && !lead.name && !lead.email) return;

    console.log("✅ NEW LEAD (or Context Capture):", {
        name: lead.name,
        email: lead.email,
        businessType: lead.businessType,
        goal: lead.goal,
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

        const requestedLang = body?.lang; // Expect 'en' or 'ar'

        // Fallback only if missing (should not happen with new widget)
        const lang = (requestedLang === 'ar' || requestedLang === 'en')
            ? requestedLang
            : 'en';

        // =========================
        // ✅ ZIZO AI System Prompt
        // =========================
        // =========================
        // ✅ ZIZO AI System Prompt (STRICT LANGUAGE CONTROL)
        // =========================
        let systemPrompt = "";

        if (lang === "ar") {
            // ARABIC PROMPT
            systemPrompt = `
أنت مساعد ZIZO الذكي (زيزو).
يجب الرد باللغة العربية فقط.
لا تغيّر اللغة إلا إذا طلب المستخدم ذلك صراحة.
حتى لو كتب المستخدم بالإنجليزية، استمر بالعربية.
الأسلوب: احترافي، سعودي/خليجي راقي، واثق، ومختصر.

مهمتك: مساعدة أصحاب المشاريع في دول الخليج على فهم خدمات Zivra.

المخرجات (JSON):
{
  "reply": "الرد النصي",
  "suggested_options": ["خيار1", "خيار2"],
  "extracted_data": { "business_type": "...", "goal": "..." }
}

خطوات المحادثة (3 خطوات فقط):

1. معرفة نوع النشاط (Business Type)
   - السؤال: "وش نوع مشروعك؟"
   - الخيارات: ["مطعم / كافيه", "فندق / سياحة", "شركة خدمات", "متجر إلكتروني", "SaaS / Startup", "غير متأكد"]

2. معرفة الهدف (Goal)
   - السؤال: "وش الهدف الأساسي اللي تركز عليه حاليًا؟"
   - الخيارات: ["زيادة المبيعات", "زيادة الحجوزات", "الأتمتة وتوفير الوقت", "تحسين تجربة العملاء"]

3. القيمة + الختام (Final Step)
   - اشرح بجملتين كيف نساعده.
   - ثم اعرض "قالب الرسالة النهائي" واطلب منه يرسله واتساب أو إيميل.
   - الخيارات المقترحة: ["WhatsApp", "Email"].

رسالة الختام المطلوبة (انسخها كما هي):
"ممتاز 👍
الخطوة التالية الأفضل هي التواصل معنا مباشرة لنقدّم لك اقتراح مناسب لحالتك.

📲 WhatsApp: https://wa.me/358401604442
📧 Email: info@zivra.co

✍️ اقترح ترسل لنا هذه الرسالة (انسخ وعدّل):

"مرحبًا ZIZO،
أنا صاحب/مدير [Business Type].
هدفي الأساسي هو [Goal].
أفضل وقت للتواصل معي هو (...)،
والمنطقة الزمنية (...).
شكرًا."

سنرد عليك بأسرع وقت."
`;
        } else {
            // ENGLISH PROMPT
            systemPrompt = `
You are ZIZO AI Assistant.
You MUST respond ONLY in English.
Never switch language unless the user explicitly changes it.
Even if the user writes Arabic, continue in English.
Tone: professional, concise, business-oriented.

Target: Business owners looking for AI & Web solutions.

Output Format (JSON):
{
  "reply": "string",
  "suggested_options": ["Option1", "Option2"],
  "extracted_data": { "business_type": "...", "goal": "..." }
}

Conversation Flow (3 Steps):

Step 1: Identify Business Type
- Ask: "What type of business are you running?"
- Options: ["Restaurant / Café", "Hotel / Tourism", "Service Business", "E-commerce", "SaaS / Startup", "Not sure yet"]

Step 2: Identify Goal
- Ask: "What is your main goal right now?"
- Options: ["Increase Sales", "More Bookings", "Save Time (Automation)", "Better CX"]

Step 3: Value + NO DATA COLLECTION + CTA
- Explain in 2 sentences how ZIVRA helps.
- THEN, IMMEDIATELY Provide the mandatory FINAL MESSAGE TEMPLATE.
- Suggested Options: ["WhatsApp", "Email"]

FINAL MESSAGE TEMPLATE (Use exactly):

"Great 👍
The best next step is to connect with us directly so we can provide a tailored proposal.

📲 WhatsApp: https://wa.me/358401604442
📧 Email: info@zivra.co

✍️ Suggested message to send us:

"Hi ZIZO,
I run a [Business Type].
My main goal is [Goal].
Best time to reach me is (...),
Timezone (...).
Thanks."

We will reply asap with clear steps."
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
            max_tokens: 450,
        });

        const content = completion.choices?.[0]?.message?.content || "{}";
        let parsed: any = {};
        try {
            parsed = JSON.parse(content);
        } catch {
            parsed = { reply: content };
        }

        const reply = safeString(parsed.reply);
        const options = Array.isArray(parsed.suggested_options) ? parsed.suggested_options : [];
        const extracted = parsed.extracted_data || {};

        // =========================
        // ✅ Anonymous Lead Submission (Context Capture)
        // =========================
        // Even without name/email, we capture the business context to the webhook
        // so the business owner knows people are interacting.
        if (extracted.business_type || extracted.goal) {
            const lead: Lead = {
                // Name/Email intentionally omitted as per new flow requirements
                businessType: extracted.business_type,
                goal: extracted.goal,
                service: extracted.business_type ? `Chat Discovery: ${extracted.business_type}` : "Chat Discovery",
                lastUserMessage: lastUser || "Start of conversation", // Safe fallback
                lang: lang,
                transcript: incoming.map((m) => ({ role: m.role, content: m.content })),
                source: "zivra-chat-widget",
            };

            await submitLead(lead);
        }

        const fallback =
            lang === "ar"
                ? "حياك الله، وش نوع مشروعك؟"
                : "Hi, what type of business do you run?";

        return NextResponse.json({
            reply: reply || fallback,
            options: options,
            // leadCaptured is less relevant now as we don't block for it, but we can return true if we reached the end
            leadCaptured: false
        });

    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json(
            { error: "AI error", details: safeString(error?.message) },
            { status: 500 }
        );
    }
}