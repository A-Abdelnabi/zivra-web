"use client";

import { useSearchParams, useParams } from "next/navigation";
import ChatWidget from "@/components/chat/chat-widget";
import { Locale } from "@/lib/i18n";
import { motion } from "framer-motion";

interface DemoPageProps {
    locale: Locale;
    dict: any;
}

export default function DemoPageContent({ locale, dict }: DemoPageProps) {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawName = searchParams.get("name") || (params.slug as string).replace(/-/g, ' ');
    const businessName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const isRtl = locale === "ar";

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            {/* Fake Header */}
            <header className="fixed top-0 left-0 right-0 z-40 h-20 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 md:px-12" dir={isRtl ? "rtl" : "ltr"}>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                        {businessName.charAt(0)}
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">{businessName}</h1>
                        <span className="text-[10px] uppercase tracking-widest text-indigo-400">{dict.demo.page.officialWebsite}</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
                    <span className="text-white">{dict.demo.page.nav.home}</span>
                    <span>{dict.demo.page.nav.menu}</span>
                    <span>{dict.demo.page.nav.locations}</span>
                    <span>{dict.demo.page.nav.contact}</span>
                </div>

                <button className="hidden md:block bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                    {dict.demo.page.orderNow}
                </button>
            </header>

            {/* Hero Section Placeholder */}
            <main className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center min-h-[80vh] text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-w-4xl mx-auto space-y-8"
                >
                    <span className="inline-block px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                        {dict.demo.page.hero.poweredBy}
                    </span>

                    <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
                        {dict.demo.page.hero.welcome} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                            {businessName}
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                        {dict.demo.page.hero.description}
                    </p>

                    <div className="pt-10 flex justify-center gap-4 opacity-50 pointer-events-none grayscale">
                        {/* Fake Social Proof */}
                        <div className="h-12 w-32 bg-white/5 rounded-lg"></div>
                        <div className="h-12 w-32 bg-white/5 rounded-lg"></div>
                        <div className="h-12 w-32 bg-white/5 rounded-lg"></div>
                    </div>
                </motion.div>

                {/* Arrow pointing to chat */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className={`fixed bottom-32 ${isRtl ? 'left-32' : 'right-32'} z-30 hidden md:block`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-white/60 font-handwriting text-xl transform -rotate-12">{dict.demo.page.hero.tryMe}</span>
                        <svg className="w-16 h-16 text-white/20 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                    </div>
                </motion.div>
            </main>

            {/* The Chat Widget - Key Component */}
            <ChatWidget locale={locale} />
        </div>
    );
}
