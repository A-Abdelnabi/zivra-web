"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { Send, RefreshCw, MessageCircle, Mail, Phone } from "lucide-react";
import Portal from "@/components/ui/Portal";
import { track } from "@/lib/track";

type Role = "assistant" | "user";
type Lang = "ar" | "en" | "fi";

type Msg = {
    id: string;
    role: Role;
    content: string;
    isContactCard?: boolean;
};

// Strict Steps: 0 = BUSINESS, 1 = SERVICE, 2 = CONTACT (Marked as Converted)
type ChatStep = 0 | 1 | 2;

const BIZ_OPTIONS = {
    en: [
        "Restaurant / Café",
        "Clinic / Medical",
        "E-commerce",
        "Service Business",
        "Startup / SaaS",
        "Not sure yet"
    ],
    ar: [
        "مطعم / كافيه",
        "عيادة / طبي",
        "متجر إلكتروني",
        "شركة خدمات",
        "شركة تقنية / SaaS",
        "مو متأكد حالياً"
    ],
    fi: [
        "Ravintola / Kahvila",
        "Klinikka / Lääkäri",
        "Verkkokauppa",
        "Palveluyritys",
        "Startup / SaaS",
        "En ole vielä varma"
    ]
};

const SERVICE_OPTIONS = {
    en: [
        "Website / Landing Page",
        "Digital Menu / QR Menu",
        "WhatsApp Ordering",
        "AI Sales/Support Chatbot",
        "Social Media Management",
        "Media Buying / Ads",
        "Automation (n8n / CRM)",
        "I need help"
    ],
    ar: [
        "موقع / صفحة هبوط",
        "منيو رقمي / باركود",
        "طلب عبر الواتساب",
        "شات بوت ذكي للمبيعات",
        "إدارة حسابات السوشيال ميديا",
        "إعلانات ممولة / Ads",
        "أتمتة (CRM / n8n)",
        "محتاج مساعدة"
    ],
    fi: [
        "Verkkosivut / Laskeutumissivu",
        "Digitaalinen Menu / QR",
        "WhatsApp-tilaus",
        "AI Myynti/Tuki Chatbot",
        "Somen Hallinta",
        "Mediamainonta / Ads",
        "Automaatio (n8n / CRM)",
        "Tarvitsen apua"
    ]
};

function getDict(lang: Lang) {
    if (lang === "ar") {
        return {
            title: "ZIZO مساعد مبيعات",
            step0: "أهلًا 👋 أنا ZIZO. نشاطك التجاري إيه؟",
            step1: "تمام 👍 محتاج إيه دلوقتي؟",
            step2: "ممتاز 👌 تحب نتواصل إزاي؟",
            whatsapp: "واتساب",
            whatsappSub: "أسرع رد",
            email: "إيميل",
            emailSub: "احصل على عرض رسمي",
            placeholder: "اكتب استفسارك...",
            typing: "جاري المعالجة...",
            closed: "تم التحويل • تواصل معنا أعلاه",
            reset: "إعادة تعيين"
        };
    }
    if (lang === "fi") {
        return {
            title: "ZIZO Myyntiassistentti",
            step0: "Hei 👋 Olen ZIZO. Millainen yritys sinulla on?",
            step1: "Hienoa 👍 Mitä tarvitset juuri nyt?",
            step2: "Täydellistä 👌 Miten haluaisit jatkaa?",
            whatsapp: "WhatsApp",
            whatsappSub: "Nopein vastaus",
            email: "Sähköposti",
            emailSub: "Pyydä virallinen tarjous",
            placeholder: "Nopea kysely...",
            typing: "ZIZO käsittelee...",
            closed: "Muunnettu • Ota yhteyttä yllä",
            reset: "Nollaa Chat"
        };
    }
    return {
        title: "ZIZO Sales Assistant",
        step0: "Hi 👋 I’m ZIZO. What type of business do you run?",
        step1: "Great. What do you need right now?",
        step2: "Perfect. How would you like to continue?",
        whatsapp: "WhatsApp",
        whatsappSub: "Fastest response",
        email: "Email",
        emailSub: "Get an official quote",
        placeholder: "Quick query...",
        typing: "ZIZO is processing...",
        closed: "Converted • Contact us above",
        reset: "Reset Chat"
    };
}

export default function ChatWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [messages, setMessages] = React.useState<Msg[]>([]);
    const [step, setStep] = React.useState<ChatStep>(0);
    const [options, setOptions] = React.useState<string[]>([]);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const lang: Lang = (locale as Lang) || "en";
    const dict = getDict(lang);
    const listRef = React.useRef<HTMLDivElement | null>(null);

    // Initial setup & Reset on Locale change
    React.useEffect(() => {
        const path = window.location.pathname;
        let welcomeMsg = dict.step0;
        let initialOptions = BIZ_OPTIONS[lang];

        if (path.includes('/sa/restaurants')) {
            welcomeMsg = lang === 'ar' ? "أهلًا 👋 تبغى تفعّل أتمتة الطلبات لمطعمك؟" : "Hi 👋 Want to activate order automation for your restaurant?";
            initialOptions = lang === 'ar' ? ["نعم، عندي مطعم/كافيه", "حاب أستفسر"] : ["Yes, I have a restaurant/café", "I have an inquiry"];
        } else if (path.includes('/demo/restaurant/')) {
            // DEMO FLOW: Deterministic & Instant
            const params = new URLSearchParams(window.location.search);
            const name = params.get('name') || "";
            const businessName = name ? (lang === 'ar' ? name : name) : (lang === 'ar' ? "مطعمك" : "your restaurant");

            welcomeMsg = lang === 'ar'
                ? `أهلًا ${businessName} 👋 إيش الخدمة اللي تحتاجها الحين؟`
                : `Hi ${businessName} 👋 What do you need right now?`;

            initialOptions = SERVICE_OPTIONS[lang];
        } else if (path.includes('/restaurants')) {
            welcomeMsg = lang === 'ar' ? "أهلًا 👋 تبغى تأتمت طلبات مطعمك أو المنيو؟" : "Hi 👋 Want to automate your restaurant orders or menu?";
            initialOptions = lang === 'ar' ? ["أتمتة الطلبات", "حجز طاولات", "استفسارات المنيو"] : ["Order Automation", "Table Booking", "Menu Inquiries"];
        } else if (path.includes('/clinics')) {
            welcomeMsg = lang === 'ar' ? "أهلًا 👋 حاب تأتمت حجوزات العيادة ومواعيد المرضى؟" : "Hi 👋 Want to automate clinic bookings and patient appointments?";
            initialOptions = lang === 'ar' ? ["حجز مواعيد", "تنبيهات المرضى", "استفسارات عامة"] : ["Book Appointments", "Patient Reminders", "General Inquiries"];
        } else if (path.includes('/services')) {
            welcomeMsg = lang === 'ar' ? "أهلًا 👋 محتاج فريق المبيعات يفرز العملاء آلياً؟" : "Hi 👋 Need your sales team to qualify leads automatically?";
            initialOptions = lang === 'ar' ? ["فرز العملاء", "ربط CRM", "أتمتة الواتساب"] : ["Lead Qualification", "CRM Sync", "WhatsApp Automation"];
        }

        setMessages([{ id: "init", role: "assistant", content: welcomeMsg }]);
        setOptions(initialOptions);
        setStep(0);
        setInput("");
        setLoading(false);
        setMounted(true);
        setOpen(false);
    }, [locale, lang, dict.step0]);

    // Body scroll lock
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [open]);

    // Auto-scroll
    React.useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, open, loading]);

    // Tracking for chat_open & Auto-open for /sa/restaurants or /demo/restaurant
    React.useEffect(() => {
        if (open) {
            track('chat_open', { source: 'chat', language: lang });
        }

        const path = window.location.pathname;
        if ((path.includes('/sa/restaurants') || path.includes('/demo/restaurant/')) && !open) {
            const timer = setTimeout(() => setOpen(true), 1000); // Slightly faster for demo
            return () => clearTimeout(timer);
        }
    }, [open, lang]);

    // Special initialization for Demo Flow to skip Step 0
    React.useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/demo/restaurant/') && mounted) {
            setStep(1); // Force step 1 (Services)
        }
    }, [mounted]);

    const addMsg = (role: Role, content: string, isContactCard: boolean = false) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content, isContactCard }]);
    };

    const handleOption = (val: string) => {
        if (loading || step >= 2) return;

        addMsg("user", val);
        setOptions([]);
        setLoading(true);

        // Tracking
        if (step === 0) {
            track('business_selected', { business_type: val, source: 'chat', language: lang });
        } else if (step === 1) {
            track('service_selected', { service_interest: val, source: 'chat', language: lang });
        }

        const nextStep = (step + 1) as ChatStep;
        const isHelpSelection = val === "I need help" || val === "محتاج مساعدة" || val === "Not sure yet" || val === "مو متأكد حالياً";
        const isRestaurantStart = val === "نعم، عندي مطعم/كافيه" || val === "Yes, I have a restaurant/café";

        if (isHelpSelection) {
            setLoading(false);
            setStep(2);
            addMsg("assistant", dict.step2, true);
            return;
        }

        setTimeout(() => {
            setLoading(false);
            if (isRestaurantStart) {
                setStep(1);
                addMsg("assistant", lang === 'ar' ? "ممتاز! عندك رقم واتساب رسمي جاهز نفعّل عليه النظام؟" : "Great! Do you have an official WhatsApp number ready?");
                setOptions(lang === 'ar' ? ["نعم، جاهز", "لا، أحتاج رقم جديد"] : ["Yes, ready", "No, I need a new one"]);
                return;
            }

            if (nextStep === 1) {
                setStep(1);
                addMsg("assistant", dict.step1);
                setOptions(SERVICE_OPTIONS[lang]);
            } else if (nextStep === 2) {
                setStep(2);
                addMsg("assistant", dict.step2, true);
                setOptions([]);
            }
        }, 600);
    };

    const handleCTA = async (userChoice?: "whatsapp" | "email" | "phone") => {
        const params = new URLSearchParams(window.location.search);

        // 1. Determine contact method
        // If passed explicitly (user clicked button), use it.
        // Otherwise, fallback to url param 'channel' or default to whatsapp.
        const channelParam = params.get('channel') as "whatsapp" | "email" | "phone" | null;
        const method = userChoice || channelParam || "whatsapp";

        // 2. Gather Data
        const businessType = messages.find(m => BIZ_OPTIONS[lang].includes(m.content))?.content || params.get('type') || "";
        const serviceInterest = messages.find(m => SERVICE_OPTIONS[lang].includes(m.content))?.content || "";
        const contactVal = params.get('contact') || "";

        const leadData = {
            name: params.get('name') || "",
            businessType: businessType,
            service: serviceInterest,
            phone: (method === "whatsapp" || method === "phone") ? contactVal : "",
            email: method === "email" ? contactVal : "",
            source: window.location.pathname.includes('/demo/') ? "demo" : "chat",
            notes: `Converted via Chat. Method: ${method}. City: ${params.get('city') || 'N/A'}. Lang: ${lang}`,
        };

        // 3. Post to leads
        fetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify(leadData)
        }).catch(() => { });

        // 4. Action
        if (method === "whatsapp") {
            track('contact_whatsapp_click', { source: 'chat', language: lang });
            window.open("https://wa.me/358401604442", "_blank");
        } else if (method === "email") {
            track('contact_email_click', { source: 'chat', language: lang });
            window.location.href = `mailto:hello@zivra.dev?subject=ZIVRA Inquiry (${serviceInterest})`;
        } else if (method === "phone") {
            window.location.href = `tel:+358401604442`;
        }
    };

    const sendMessage = () => {
        if (!input.trim() || step >= 2 || loading) return;
        const text = input.trim();
        setInput("");
        addMsg("user", text);
        setLoading(true);

        // Immediate conversion on direct message
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            addMsg("assistant", dict.step2, true);
        }, 800);
    };

    const resetChat = () => {
        setMessages([{ id: crypto.randomUUID(), role: "assistant", content: dict.step0 }]);
        setOptions(BIZ_OPTIONS[lang]);
        setStep(0);
        setInput("");
        setLoading(false);
    };

    const isRtl = lang === "ar";
    if (!mounted) return null;

    return (
        <>
            <Portal>
                {/* Fixed container - always in DOM, controlled by CSS visibility/opacity */}
                <div
                    className={`fixed inset-0 z-[9999] pointer-events-none transition-all duration-500 ease-in-out ${open ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                >
                    {/* Main UI window - pointer-events-auto */}
                    <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className={`absolute bottom-24 ${isRtl ? 'left-5 md:left-8' : 'right-5 md:right-8'} w-[380px] max-w-[calc(100vw-40px)] h-[580px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white/90 backdrop-blur-3xl transition-transform duration-500 pointer-events-auto ${open ? 'translate-y-0' : 'translate-y-10'
                            }`}
                        style={{ pointerEvents: open ? 'auto' : 'none' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                                    <Image src="/images/zivra-logo.jpg" alt="ZIVRA" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-foreground tracking-tight leading-none uppercase">{dict.title}</h3>
                                    <button
                                        onClick={resetChat}
                                        className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5 hover:text-primary transition-colors"
                                    >
                                        <RefreshCw size={9} /> {dict.reset}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-slate-100 transition-all"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>

                        {/* Message Feed */}
                        <div
                            ref={listRef}
                            className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth overscroll-contain"
                        >
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                    {m.isContactCard ? (
                                        <div className="w-full max-w-[95%] bg-primary/5 rounded-3xl p-6 border border-primary/20 backdrop-blur-md shadow-lg space-y-4">
                                            <p className="text-sm font-bold text-foreground mb-2 leading-relaxed">{m.content}</p>

                                            {(() => {
                                                // Dynamic Logic for Contact Button in Chat
                                                // If we are in demo flow, default to what user picked.
                                                const params = new URLSearchParams(window.location.search);
                                                const channel = params.get('channel');

                                                // Always show WhatsApp + Email? Or prioritize user choice?
                                                // Req said: "Immediately show contact methods based on what user selected"
                                                // So if user picked Phone -> Show Call button.

                                                return (
                                                    <>
                                                        {(!channel || channel === 'whatsapp') && (
                                                            <button
                                                                onClick={() => handleCTA("whatsapp")}
                                                                className="w-full flex items-center gap-4 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-2xl p-4 transition-all group shadow-sm"
                                                            >
                                                                <div className="h-11 w-11 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                                                    <MessageCircle className="text-primary" size={20} />
                                                                </div>
                                                                <div className="flex-1 text-start">
                                                                    <span className="text-sm font-black text-foreground block uppercase tracking-wide">{dict.whatsapp}</span>
                                                                    <span className="text-[10px] text-primary uppercase tracking-widest font-bold">{dict.whatsappSub}</span>
                                                                </div>
                                                            </button>
                                                        )}

                                                        {channel === 'phone' && (
                                                            <button
                                                                onClick={() => handleCTA("phone")}
                                                                className="w-full flex items-center gap-4 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-2xl p-4 transition-all group shadow-sm"
                                                            >
                                                                <div className="h-11 w-11 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                                                    <Phone className="text-primary" size={20} />
                                                                </div>
                                                                <div className="flex-1 text-start">
                                                                    <span className="text-sm font-black text-foreground block uppercase tracking-wide">{isRtl ? 'اتصل بنا' : 'Call Us'}</span>
                                                                    <span className="text-[10px] text-primary uppercase tracking-widest font-bold">{isRtl ? 'مكالمة هاتفية' : 'Direct Call'}</span>
                                                                </div>
                                                            </button>
                                                        )}

                                                        {channel === 'email' && (
                                                            <button
                                                                onClick={() => handleCTA("email")}
                                                                className="w-full flex items-center gap-4 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-2xl p-4 transition-all group shadow-sm"
                                                            >
                                                                <div className="h-11 w-11 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                                                    <Mail className="text-muted-foreground" size={20} />
                                                                </div>
                                                                <div className="flex-1 text-start">
                                                                    <span className="text-sm font-black text-foreground block uppercase tracking-wide">{dict.email}</span>
                                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{dict.emailSub}</span>
                                                                </div>
                                                            </button>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${m.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-slate-100 text-foreground border border-slate-200 rounded-tl-none"
                                            }`}>
                                            {m.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-50 rounded-full px-4 py-2 text-primary text-[9px] font-black tracking-[0.2em] uppercase animate-pulse border border-slate-100">
                                        {dict.typing}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions Component */}
                        <div className="px-6 py-6 bg-gradient-to-t from-white to-white/90 border-t border-slate-100">
                            {options.length > 0 && step < 2 && (
                                <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in zoom-in-95 duration-500">
                                    {options.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleOption(opt)}
                                            className="rounded-full bg-primary/5 px-5 py-3 text-[11px] font-bold text-primary hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all border border-primary/20 whitespace-nowrap"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step < 2 ? (
                                <div className={`relative flex items-center gap-3 transition-opacity duration-300 ${step === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder={dict.placeholder}
                                        disabled={step === 0}
                                        className="flex-1 h-12 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={loading || !input.trim() || step === 0}
                                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-0"
                                    >
                                        <Send size={18} className={isRtl ? 'rotate-180' : ''} />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">
                                    {dict.closed}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Portal>

            {/* Float Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-[10000] h-18 w-18 md:h-20 md:w-20 rounded-full bg-primary text-white shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center group pointer-events-auto"
            >
                {open ? (
                    <span className="text-2xl font-light">✕</span>
                ) : (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shadow-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                        <Image src="/images/zivra-logo.jpg" alt="ZIVRA" fill className="object-cover" />
                    </div>
                )}
            </button>
        </>
    );
}