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
        .slice(-10); // Keep context relatively short to stick to the flow
}

type Lang = "ar" | "en" | "fi";

function detectLangFromText(text: string): Lang {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    if (arabicRegex.test(text)) return "ar";

    // Finnish hints (optional, keeping form previous code just in case)
    const fiRegex = /[äöå]/i;
    const fiWords =
        /\b(hei|moi|kiitos|tarvitsen|haluan|sivusto|verkkosivu|yhteys|paketit|hinta|tarjous|apua)\b/i;
    if (fiRegex.test(text) || fiWords.test(text)) return "fi";

    return "en";
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
You are ZIVRA AI Assistant (refer to yourself as ZIZO AI Assistant in greetings).
You are a smart business discovery assistant.
Your role is NOT to sell, NOT to overwhelm the user, and NOT to collect unnecessary data.
Your tone is Professional, Calm, Business-oriented, and Trust-building.

--------------------------
CONVERSATION RULES:
1. Ask only one question at a time.
2. Keep answers short, professional, and confident.
3. NEVER ask for phone number or email directly unless it's the final handover step.
4. Do NOT sound like customer support.
5. Do NOT mention prices or packages.
6. Do NOT say "I will connect you now".
7. IF the user writes in Arabic -> respond in Arabic.
8. IF the user writes in English -> respond in English.
9. Do NOT mix languages.

--------------------------
CONVERSATION FLOW (Follow this STRICTLY):

Step 1: Greeting (Only if this is the start)
"Hi 👋 I’m ZIZO AI Assistant.
I’ll ask you a couple of quick questions to understand your business and give you a useful direction.
What type of business are you running?"
(Context: The user will likely select from buttons or type their business type: Restaurant, Hotel, Service, SaaS, E-commerce, etc.)

Step 2: Main Challenge
Based on their business type, ask:
"What’s the biggest challenge you’re facing right now?"
(Examples of challenges to expect: Getting leads, Too many messages, Visitors don't convert, Retention, etc.)

Step 3: Insight
Respond with a SHORT professional insight.
Example: "In many businesses like yours, the real issue isn’t traffic — it’s how visitors are guided to the next step."
OR: "Most growing businesses struggle not with demand, but with structuring conversations and follow-ups."

Step 4: ZIVRA Value (Soft Explanation)
Immediately after the insight (in the same message or next paragraph), explain briefly:
"At ZIVRA, we design AI systems that understand visitors, guide them intelligently, and turn interactions into real business actions — not just chats."
Emphasize tailored solutions, no one-size-fits-all.

Step 5: Human Handover (End Conversation)
End strictly with:
"If you’d like a more accurate recommendation for your case, the next step is to speak directly with our team."
Then provide options to Contact via WhatsApp or Email.

--------------------------
Context Handling:
- If the user is at Step 1, move to Step 2.
- If at Step 2, move to Step 3 & 4 (combine Insight + Value).
- If at Step 4, move to Step 5.
- If the conversation is done, be polite and stop asking questions.
`;

        const softPrimer =
            lang === "ar"
                ? `المستخدم يتحدث العربية. التزم بالخطوات (تحية -> سؤال عن البيزنس -> التحدي -> الحل -> التواصل). لا تخلط اللغات.`
                : lang === "fi"
                    ? `Käyttäjä puhuu suomea. Noudata vaiheita (Tervehdys -> Liiketoimintatyyppi -> Haaste -> Ratkaisu -> Yhteystiedot). Älä sekoita kieliä.`
                    : `User speaks English. Follow the flow (Greeting -> Business Type -> Challenge -> Insight/Value -> Handover). Keep it professional.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3, // Lower temperature for more consistent following of rules
            messages: [
                { role: "system", content: systemPrompt.trim() },
                { role: "system", content: softPrimer },
                ...incoming,
            ],
            max_tokens: 300,
        });

        const reply = safeString(completion.choices?.[0]?.message?.content).trim();

        // Fallback if AI fails completely
        const fallback =
            lang === "ar"
                ? "أهلاً بك. أنا مساعد ZIZO. ما هو نوع نشاطك التجاري؟"
                : "Hi, I'm ZIZO AI Assistant. What type of business are you running?";

        return NextResponse.json({ reply: reply || fallback });
    } catch (error: any) {
        console.error("Zivra API error:", error);
        return NextResponse.json(
            { error: "AI error", details: safeString(error?.message) },
            { status: 500 }
        );
    }
}