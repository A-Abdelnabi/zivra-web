"use client";

import * as React from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { Send, RefreshCw, MessageCircle, Mail } from "lucide-react";
import Portal from "@/components/ui/Portal";
import { trackEvent } from "@/lib/analytics";

type Role = "assistant" | "user";
type Lang = "ar" | "en";

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
    ]
};

const SERVICE_OPTIONS = {
    en: [
        "Website / Landing Page",
        "AI Chatbot",
        "WhatsApp Automation",
        "Marketing / Social Media",
        "I need help"
    ],
    ar: [
        "موقع / صفحة هبوط",
        "شات بوت ذكي",
        "أتمتة واتساب",
        "تسويق وسوشيال ميديا",
        "محتاج مساعدة"
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

        if (path.includes('/restaurants')) {
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

    // Tracking for chat_open
    React.useEffect(() => {
        if (open) {
            trackEvent('chat_open', { language: lang });
        }
    }, [open, lang]);

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
            trackEvent('business_selected', { business_type: val, language: lang });
        } else if (step === 1) {
            trackEvent('service_selected', { service_type: val, language: lang });
        }

        const nextStep = (step + 1) as ChatStep;
        const isHelpSelection = val === "I need help" || val === "محتاج مساعدة" || val === "Not sure yet" || val === "مو متأكد حالياً";

        if (isHelpSelection) {
            setLoading(false);
            setStep(2);
            addMsg("assistant", dict.step2, true);
            return;
        }

        setTimeout(() => {
            setLoading(false);
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

    const handleCTA = (method: "whatsapp" | "email") => {
        if (method === "whatsapp") {
            trackEvent('contact_whatsapp_click', { language: lang });
            window.open("https://wa.me/358401604442", "_blank");
        } else {
            trackEvent('contact_email_click', { language: lang });
            window.location.href = `mailto:hello@zivra.dev?subject=ZIVRA Inquiry (${lang === 'ar' ? 'طلب استفسار' : 'Inquiry'})`;
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
                        className={`absolute bottom-24 ${isRtl ? 'left-5 md:left-8' : 'right-5 md:right-8'} w-[380px] max-w-[calc(100vw-40px)] h-[580px] flex flex-col rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,10,20,0.6)] border border-white/10 bg-black/90 backdrop-blur-3xl transition-transform duration-500 pointer-events-auto ${open ? 'translate-y-0' : 'translate-y-10'
                            }`}
                        style={{ pointerEvents: open ? 'auto' : 'none' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-indigo-500/20">
                                    <Image src="/images/zivra-logo.jpg" alt="ZIVRA" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-white tracking-tight leading-none uppercase">{dict.title}</h3>
                                    <button
                                        onClick={resetChat}
                                        className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                                    >
                                        <RefreshCw size={9} /> {dict.reset}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="h-9 w-9 flex items-center justify-center rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-all"
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
                                        <div className="w-full max-w-[95%] bg-indigo-600/10 rounded-3xl p-6 border-2 border-indigo-500/30 backdrop-blur-md shadow-2xl space-y-4">
                                            <p className="text-sm font-bold text-white mb-2 leading-relaxed">{m.content}</p>

                                            <button
                                                onClick={() => handleCTA("whatsapp")}
                                                className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-2xl p-4 transition-all group"
                                            >
                                                <div className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                    <MessageCircle className="text-white" size={20} />
                                                </div>
                                                <div className="flex-1 text-start">
                                                    <span className="text-sm font-black text-white block uppercase tracking-wide">{dict.whatsapp}</span>
                                                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">{dict.whatsappSub}</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleCTA("email")}
                                                className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-2xl p-4 transition-all group"
                                            >
                                                <div className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                    <Mail className="text-white/60" size={20} />
                                                </div>
                                                <div className="flex-1 text-start">
                                                    <span className="text-sm font-black text-white block uppercase tracking-wide">{dict.email}</span>
                                                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{dict.emailSub}</span>
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg ${m.role === "user"
                                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none"
                                            : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md"
                                            }`}>
                                            {m.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-full px-4 py-2 text-indigo-400 text-[9px] font-black tracking-[0.2em] uppercase animate-pulse border border-white/5">
                                        {dict.typing}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions Component */}
                        <div className="px-6 py-6 bg-gradient-to-t from-black/60 to-transparent border-t border-white/5">
                            {options.length > 0 && step < 2 && (
                                <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in zoom-in-95 duration-500">
                                    {options.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleOption(opt)}
                                            className="rounded-full bg-indigo-500/10 px-5 py-3 text-[11px] font-bold text-white hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all border border-indigo-500/30 whitespace-nowrap"
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
                                        className="flex-1 h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
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
                                <div className="h-12 flex items-center justify-center rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[9px] uppercase tracking-[0.3em] font-black text-indigo-400/50">
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
                className="fixed bottom-6 right-6 z-[10000] h-18 w-18 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:scale-110 active:scale-90 transition-all flex items-center justify-center group pointer-events-auto"
            >
                {open ? (
                    <span className="text-2xl font-light">✕</span>
                ) : (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shadow-2xl ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                        <Image src="/images/zivra-logo.jpg" alt="ZIVRA" fill className="object-cover" />
                    </div>
                )}
            </button>
        </>
    );
}