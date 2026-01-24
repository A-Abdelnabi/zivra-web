"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function RestaurantDemoEntry() {
    // We can use barebones translations or partials if full keys aren't available yet
    // For now, hardcoded English/Arabic fallback or simple strings is safest
    // until we confirm messages/en.json layout. using generic approach.
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [name, setName] = useState("");
    const [type, setType] = useState("Restaurant");
    const [loading, setLoading] = useState(false);

    const isRtl = locale === "ar";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        // Simulate a small delay for effect
        setTimeout(() => {
            router.push(`/${locale}/demo/restaurant/${slug}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        {isRtl ? "جرب العرض التوضيحي" : "Start Live Demo"}
                    </h1>
                    <p className="text-white/40 text-sm mt-2">
                        {isRtl ? "شوف كيف زيفرا ممكن تغير مطعمك" : "See how ZIVRA can transform your business"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                            {isRtl ? "اسم المطعم / النشاط" : "Business Name"}
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isRtl ? "مثال: برجر ستيشن" : "Ex: Burger Station"}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus:border-indigo-500/50 outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                            {isRtl ? "نوع النشاط" : "Business Type"}
                        </label>
                        <div className="relative">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white outline-none appearance-none focus:border-indigo-500/50 transition-colors"
                            >
                                <option value="Restaurant">Restaurant</option>
                                <option value="Café">Café</option>
                                <option value="Food Truck">Food Truck</option>
                                <option value="Cloud Kitchen">Cloud Kitchen</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className={`absolute top-0 h-full flex items-center pointer-events-none text-white/20 ${isRtl ? 'left-4' : 'right-4'}`}>
                                ▼
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">{isRtl ? "جاري تحضير العرض..." : "Building Demo..."}</span>
                        ) : (
                            <span>{isRtl ? "ابدأ العرض الآن" : "Start Restaurant Demo"}</span>
                        )}
                    </button>

                    <p className="text-[10px] text-white/20 text-center uppercase tracking-widest mt-6">
                        {isRtl ? "مجاني ولا يحتاج تسجيل" : "No generic videos • Real interactions"}
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
