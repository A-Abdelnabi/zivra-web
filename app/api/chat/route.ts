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

type Lang = "ar" | "en";

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        const incoming = normalizeMessages(body?.messages);
        const lang = body?.lang === 'ar' ? 'ar' : 'en';

        // =========================
        // ✅ ZIZO AI System Prompt (Sales Engine & Gulf Tone)
        // =========================
        let systemPrompt = "";

        if (lang === "ar") {
            systemPrompt = `
أنت (زيزو - ZIZO)، المهندس التقني وخبير المبيعات في ZIVRA.
بزنس ZIVRA يبني مواقع، تطبيقات، ويؤتمت العمليات بالذكاء الاصطناعي (AI Automation)، وعندنا محرك نمو للسوشيال ميديا.

مهمتك الأساسية: "إغلاق البيعة" أو توجيه العميل للباقة اللي تخليه ينجح، بأسلوب سعودي/خليجي، فزعة، وذكي.

القواعد:
1. اللغة: سعودي/خليجي أبيض (Urban Saudi). لا تستخدم فصحى ولا ترجمة حرفية.
2. الأسلوب: واثق، مهتم بنجاح العميل، ومختصر جداً.
3. لا تجمع بيانات شخصية (مثل الاسم أو الإيميل) وسط الشات.
4. التوصية: بمجرد ما تفهم احتياج العميل (موقع، أتمتة، مبيعات، سوشيال ميديا)، اقترح باقة واحدة "فقط" ووضح ليه هي الأنسب له.

الباقات المتاحة:
- Starter ($159): للمشاريع الصغيرة، موقع تعريفي + ذكاء اصطناعي أساسي.
- Growth ($529): للمطاعم والشركات، أتمتة مبيعات + واتساب + ذكاء اصطناعي مدرب.
- Scale ($949): للمؤسسات والشركات الكبيرة.
- Social Engine (2 منصات $399 / 3 منصات $699 / 4 منصات $1199).

خطوات المحادثة:
1. رحب بالعميل واسأله وش نوع شغله (مطعم، شركة، متجر، الخ).
2. افهم منه وش وده يحقق (مبيعات، توفير وقت، انتشار).
3. إذا الكلام عن السوشيال ميديا، اسأله: "وش المنصات اللي تبي نركز عليها؟ (انستقرام، تيك توك، سناب، X)". وبعدها اقترح الباقة (2 أو 3 أو 4 منصات).
4. الختام: عط التوصية النهائية ووجهه للواتساب أو الإيميل فوراً.

المخرجات (JSON):
{
  "reply": "الرد النصي بأسلوب خليجي",
  "suggested_options": ["خيار1", "خيار2"],
  "recommended_package": "اسم الباقة",
  "data": { "business": "...", "intent": "...", "platforms": "..." }
}

مثال لرد ختامي:
"بناءً على كلامك، أنسب خيار لك هو باقة Growth لأنها بتشيل عنك هم متابعة العملاء وتأتمت لك الواتساب بالكامل. لو حاب نبدأ، كلمنا واتساب ونعطيك العلم الأكيد."
`;
        } else {
            systemPrompt = `
You are (ZIZO), the tech lead & sales architect at ZIVRA.
ZIVRA builds websites, apps, designs AI Automations, and manages social media growth.

Goal: Finalize package selection and push to WhatsApp/Email.

Rules:
1. Tone: Professional, confident, high-end SaaS expert.
2. Directness: Be extremely concise.
3. No Data Collection: Never ask for name or email in chat.
4. Recommendation: Suggest ONE specific package based on business needs.

Packages:
- Starter ($159): Website + Basic AI.
- Growth ($529): Best for Restaurants/Clinics, includes WhatsApp automation & lead nurturing.
- Scale ($949): Enterprise.
- Social Engine (2 platforms $399 / 3 platforms $699 / 4 platforms $1199).

Flow:
1. Welcome & ask about business type.
2. Ask about main goals (sales, time-saving, leads).
3. If social media is mentioned, ask for platforms (Instagram, TikTok, Snapchat, X, LinkedIn).
4. Finalize with a clear recommendation and push to WhatsApp or Email buttons.

Output Format (JSON):
{
  "reply": "concise text",
  "suggested_options": ["Option1", "Option2"],
  "recommended_package": "Package Name",
  "data": { "business": "...", "intent": "...", "platforms": "..." }
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
            max_tokens: 450,
        });

        const content = completion.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);

        return NextResponse.json({
            reply: parsed.reply,
            options: parsed.suggested_options || [],
            recommendedPackage: parsed.recommended_package || null,
            context: parsed.data || {}
        });

    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json({ error: "AI error" }, { status: 500 });
    }
}