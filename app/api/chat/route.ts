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
        .slice(-12);
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);

        // Language detection - prioritize explicit 'lang' in body, then detect from last message
        const lastUserMsg = [...incoming].reverse().find(m => m.role === 'user')?.content || "";
        const arabicRegex = /[\u0600-\u06FF]/;
        const detectedLang = arabicRegex.test(lastUserMsg) ? 'ar' : 'en';
        const lang = body?.lang || detectedLang;

        // =========================
        // ✅ ZIZO AI System Prompt (Two-Mode Architecture)
        // =========================
        let systemPrompt = "";

        if (lang === "ar") {
            systemPrompt = `
أنت (زيزو - ZIZO)، مساعد مبيعات ذكي وبريميوم لشركة ZIVRA.
هدفك الأساسي: توجيه الزوار عبر رحلة اكتشاف سريعة ثم تحويلهم للواتساب أو الإيميل.

⚠️ قاعدة اللغة: رد باللغة العربية حصراً (لهجة مرنة، سعودية/خليجية، احترافية). لا تخلط اللغات.

هيكل المحادثة:

النظام أ: الاكتشاف والتحويل (الوضع الافتراضي)
الخطوة 1) إذا كانت هذه أول رسالة، اسأل عن نوع المشروع:
["مطعم / كافيه", "عيادة / طبي", "فندق / سياحة", "شركة خدمات", "متجر إلكتروني", "Startup / SaaS", "سوشيال ميديا / محتوى", "غير متأكد"]

الخطوة 2) بعد تحديد النوع، اعرض الخدمات مباشرة كأزرار:
["Website / Landing", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Capture + Follow-up", "Social Media Growth", "ساعدوني في الاختيار"]
* أضف جملة واحدة فقط توضح القيمة بناءً على نوع المشروع (مثلاً: للمطاعم، "نقدر نخلي الحجوزات والمنيو يشتغلون عنك بذكاء").

الخطوة 3) اسأل مباشرة: "كيف تفضل نكمل تواصلنا؟" واعرض خيارات: ["واتساب 💬", "إيميل ✉️"]

النظام ب: الاستشارة الموجهة (فقط إذا طلب العميل تفاصيل أو مساعدة في الاختيار)
أمثلة للمحفزات: "وش الفوائد؟"، "ساعدني اختار"، "إيش الأنسب لي؟"، "مو متأكد".

الخطوات:
1) اسأل سؤال واحد عن الأولوية: ["زيادة مبيعات", "توليد عملاء", "توفير وقت / أتمتة", "تحسين البراند والمحتوى", "غير متأكد"]
2) اسأل عن حجم البزنس إذا لزم الأمر فقط: ["صغير", "متوسط", "كبير"]
3) اشرح الخدمات باختصار شديد (جملتين كحد أقصى لكل خدمة) وبدون مصطلحات تقنية معقدة.
4) رشح أفضل خيار أو خيارين فقط.
5) الختام: "لبدء التنفيذ والحصول على خطة وسعر مخصص، تواصل معنا عبر الواتساب أو الإيميل." وعرض الأزرار.

⚠️ قواعد عامة:
- لا تطلب بيانات شخصية (رقم/إيميل) داخل الشات. التحويل يكون عبر زر الواتساب أو الإيميل الخارجي.
- كن مختصراً، واثقاً، ومفيداً جداً.
- التنسيق للمخرجات يجب أن يكون JSON.

{
  "reply": "نص الرد الخليجي المختصر",
  "suggested_options": ["خيار1", "خيار2"],
  "mode": "A or B"
}
`;
        } else {
            systemPrompt = `
You are (ZIZO), a premium sales & discovery assistant for ZIVRA.
Goal: Guide visitors through a smart discovery flow and route them to WhatsApp or Email.

⚠️ Language Rule: Respond ONLY in English. Never mix languages.

Conversation Architecture:

Mode A: Discovery & Routing (Default)
Step 1) If starting, ask for business type:
["Restaurant / Cafe", "Clinic / Medical", "Hotel / Tourism", "Service Business", "E-commerce", "Startup / SaaS", "Social Media / Content", "Not sure yet"]

Step 2) Once business type is known, show services as buttons:
["Website / Landing", "Web App / Dashboard", "AI Chatbot", "Automation (n8n)", "Lead Capture + Follow-up", "Social Media Growth", "Help me choose"]
* Add one short value sentence based on the business type.

Step 3) Immediately ask: "How would you like to continue?" and show buttons: ["WhatsApp 💬", "Email ✉️"]

Mode B: Guided Consultation (Only if explicitly asked for help/details)
Triggers: "What are the benefits?", "Help me choose", "Which is best?", "I am not sure".

Steps:
1) Ask ONE clarifying priority question: ["Increase Sales", "Generate Leads", "Save Time / Automate", "Improve Brand & Content", "Not sure"]
2) Ask business size ONLY if needed: ["Small", "Medium", "Large"]
3) Explain services briefly (max 2 short sentences each). No jargon.
4) Recommend 1-2 best options based on needs.
5) Closing: "To proceed and get a tailored plan + exact quote, contact us on WhatsApp or Email." + CTA buttons.

⚠️ Rules:
- Do NOT request phone or email in chat.
- Be concise, professional, and helpful.
- Output MUST be JSON.

{
  "reply": "string",
  "suggested_options": ["Option1", "Option2"],
  "mode": "A or B"
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
            max_tokens: 500,
        });

        const content = completion.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);

        return NextResponse.json({
            reply: parsed.reply,
            options: parsed.suggested_options || [],
            mode: parsed.mode || "A"
        });

    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json({ error: "AI error" }, { status: 500 });
    }
}