"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface DemoEntryProps {
    locale: string;
    dict: any; // Using simplified type or import Dictionary if accessible
}

export default function DemoEntryForm({ locale, dict }: DemoEntryProps) {
    const router = useRouter();
    const isRtl = locale === "ar";

    // State
    const [name, setName] = useState("");
    const [type, setType] = useState("Restaurant");
    const [channel, setChannel] = useState<"whatsapp" | "email" | "phone">("whatsapp");
    const [contactVal, setContactVal] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);

    // Detect placeholder based on channel
    const contactPlaceholder =
        channel === "email" ? dict.demo.entry.contactPlaceholder.email :
            dict.demo.entry.contactPlaceholder.phone;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const leadData = {
            name: name,
            businessType: type,
            phone: (channel === "whatsapp" || channel === "phone") ? contactVal : "",
            email: channel === "email" ? contactVal : "",
            source: "demo",
            notes: `City: ${city}, Pref: ${channel}, Step: Entry`
        };

        try {
            await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(leadData)
            });
        } catch (err) {
            console.error("Lead save failed", err);
        }

        setTimeout(() => {
            const query = new URLSearchParams({
                name: name,
                type: type,
                channel: channel,
                contact: contactVal,
                city: city
            }).toString();

            router.push(`/${locale}/demo/restaurant/${slug}?${query}`);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        {dict.demo.entry.title}
                    </h1>
                    <p className="text-white/40 text-sm mt-3">
                        {dict.demo.entry.subtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>

                    {/* Business Name */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                            {dict.demo.entry.nameLabel}
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={dict.demo.entry.namePlaceholder}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus:border-indigo-500/50 outline-none transition-colors"
                        />
                    </div>

                    {/* Type & City */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                                {dict.demo.entry.typeLabel}
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-2 md:px-4 text-white outline-none appearance-none"
                            >
                                <option value="Restaurant">{dict.demo.entry.types.restaurant}</option>
                                <option value="Café">{dict.demo.entry.types.cafe}</option>
                                <option value="Cloud Kitchen">{dict.demo.entry.types.cloud_kitchen}</option>
                                <option value="Catering">{dict.demo.entry.types.catering}</option>
                                <option value="Other">{dict.demo.entry.types.other}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                                {dict.demo.entry.cityLabel}
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder={dict.demo.entry.cityPlaceholder}
                                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:border-indigo-500/50 outline-none"
                            />
                        </div>
                    </div>

                    {/* Contact Preference */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                            {dict.demo.entry.contactLabel}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['whatsapp', 'email', 'phone'].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { setChannel(c as any); setContactVal(""); }}
                                    className={`h-10 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${channel === c
                                            ? "bg-indigo-600 border-indigo-500 text-white"
                                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Contact Input */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/30 font-bold ml-1">
                            {channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'Phone'}
                        </label>
                        <input
                            required
                            type={channel === 'email' ? 'email' : 'tel'}
                            value={contactVal}
                            onChange={(e) => setContactVal(e.target.value)}
                            placeholder={contactPlaceholder}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:border-indigo-500/50 outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim() || !contactVal.trim()}
                        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-6 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">{dict.demo.entry.cta.loading}</span>
                        ) : (
                            <span>{dict.demo.entry.cta.default}</span>
                        )}
                    </button>

                    <p className="text-[10px] text-white/20 text-center uppercase tracking-widest mt-6">
                        {dict.demo.entry.footer}
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
