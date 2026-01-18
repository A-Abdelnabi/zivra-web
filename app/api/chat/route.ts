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
    console.log("✅ NEW LEAD:", {
        name: lead.name,
        email: lead.email,
        businessType: lead.businessType,
        goal: lead.goal,
        painPoint: lead.painPoint,
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
        // ✅ ZIZO AI System Prompt
        // =========================
        const systemPrompt = `
You are ZIZO AI Assistant (زيزو), a smart business discovery assistant for "Zivra".
Your goal is to understand the user's business, identify a challenge, and direct them to contact us via WhatsApp/Email.

Your output must be a valid JSON object with this structure:
{
  "reply": "The message text to show the user",
  "suggested_options": ["Option 1", "Option 2"], // Optional: Buttons to show valid choices
  "extracted_data": {
     "name": "...", 
     "email": "...", 
     "business_type": "...", 
     "goal": "...", 
     "pain_point": "..." 
  }
}

--------------------------
TONE & LANGUAGE RULES:
- If User speaks English -> Reply in Professional English.
- If User speaks Finnish -> Reply in Professional Finnish.
- If User speaks Arabic -> Reply in **Gulf-neutral Arabic** (Saudi/UAE style).
  - Use words like: "هلا بك", "تمام", "أبشر", "وش", "يعطيك العافية".
  - Avoid formal MSA (e.g., "يرجى", "نود إفادتكم").
  - Be short, professional, and friendly.

--------------------------
CONVERSATION FLOW (Follow Strictly):

Step 1: Identify Business Type (If not known)
- Ask: "What type of business are you running?" (Arabic: "وش نوع مشروعك؟")
- Options (Arabic): ["مطعم / كافيه", "فندق / سياحة", "خدمات / شركة", "SaaS / شركة تقنية", "متجر إلكتروني", "لست متأكد"]

Step 2: Identify Main Goal (If not known)
- Ask: "What is your main goal right now?" (Arabic: "وش هدفك الحالي؟")
- Options (Arabic): ["زيادة المبيعات", "زيادة الحجوزات", "جمع عملاء (Leads)", "أتمتة الشغل", "شات بوت ذكي"]

Step 3: Identify Pain Point (If not known)
- Ask: "What challenges are stopping you?" (Arabic: "وش التحدي اللي يواجهك؟")
- Options (Arabic): ["ما في متابعة", "طلبات كثيرة وضياع", "الموقع بطيء", "نحتاج نظام حجز", "نبي تقارير دقيقة"]

Step 4: Value Snippet & Mini-ROI
- Provide a SHORT tailor-made insight. (2-3 lines max).
- Explain how AI/Automation helps specific updates to their pain point.
- *Immediately* ask for their Name and Email in the same message to send the details/recommendation. "May I have your name and email to send this recommendation?"

Step 5: Human Handover
- Once Name/Email are provided (or if they refuse):
- Say: "Thank you. To get the fastest solution, contact us directly."
- Do NOT ask more questions.
- Options: ["WhatsApp", "Email"] (Frontend handles the actual links, you just provide the text or empty options).

--------------------------
RULES:
1. Ask ONE question at a time.
2. Keep replies SHORT (max 2-3 sentences).
3. Populate 'suggested_options' with the relevant list for the current step.
4. If the user gives data (Name/Email/Business), extract it in 'extracted_data'.
5. Do NOT collect Phone numbers.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt.trim() },
                ...incoming,
            ],
            max_tokens: 400,
        });

        const content = completion.choices?.[0]?.message?.content || "{}";
        let parsed: any = {};
        try {
            parsed = JSON.parse(content);
        } catch {
            parsed = { reply: content }; // Fallback
        }

        const reply = safeString(parsed.reply);
        const options = Array.isArray(parsed.suggested_options) ? parsed.suggested_options : [];
        const extracted = parsed.extracted_data || {};

        // =========================
        // ✅ Lead Submission
        // =========================
        // Trigger submission if we have critical info (Name + Email) AND it's a new capture
        // Or if we are deep in the conversation.
        // For simplicity, we send every time we have at least Name or Email to ensure we capture partials? 
        // No, let's send when we have Name AND Email, OR if we have Business+Goal+Pain and user is anonymous.
        // User asked: "Keep lead capture working... send it to existing webhook".

        // We reconstruct the Lead object from the extracted data + transcript
        if (extracted.name || extracted.email || extracted.business_type) {
            const lead: Lead = {
                name: extracted.name,
                email: extracted.email,
                businessType: extracted.business_type,
                goal: extracted.goal,
                painPoint: extracted.pain_point,
                service: extracted.business_type ? `Discovery: ${extracted.business_type}` : "AI Discovery",
                lastUserMessage: lastUser,
                lang: lang,
                transcript: incoming.map((m) => ({ role: m.role, content: m.content })),
                source: "zivra-chat-widget",
            };

            // Fire and forget (don't await to speed up UI?) -> No, users expect confirmation.
            // But usually we don't want to block the chat.
            // We only log/send if we have meaningful data.
            if (lead.email || lead.name) {
                await submitLead(lead);
            }
        }

        const fallback =
            lang === "ar"
                ? "حياك الله، وش نوع مشروعك؟"
                : "Hi, what type of business do you run?";

        return NextResponse.json({
            reply: reply || fallback,
            options: options,
            leadCaptured: !!(extracted.name && extracted.email)
        });

    } catch (error: any) {
        console.error("Zivra API error:", error);
        // Fallback JSON error response
        return NextResponse.json(
            { error: "AI error", details: safeString(error?.message) },
            { status: 500 }
        );
    }
}