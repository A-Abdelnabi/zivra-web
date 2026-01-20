"use client";

import * as React from "react";
import { RestaurantTenant, MenuItem, Locale } from "@/lib/restaurant/types";
import { getTenantBySlug } from "@/lib/restaurant/data";
import { ConsentModal } from "@/components/restaurant/ConsentModal";
import { MenuCard } from "@/components/restaurant/MenuCard";
import RestaurantChat from "@/components/restaurant/RestaurantChat";
import { logRestaurantInteraction } from "@/lib/restaurant/analytics";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";

export default function RestaurantPortal({
    slug,
    locale
}: {
    slug: string;
    locale: Locale
}) {
    const [tenant, setTenant] = React.useState<RestaurantTenant | null>(null);
    const [consent, setConsent] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const isRtl = locale === 'ar';

    React.useEffect(() => {
        getTenantBySlug(slug).then(data => {
            setTenant(data);
            setLoading(false);
        });
        const hasConsent = localStorage.getItem(`consent_${slug}`);
        if (hasConsent) setConsent(true);
    }, [slug]);

    const handleAccept = () => {
        setConsent(true);
        localStorage.setItem(`consent_${slug}`, 'true');
        if (tenant) logRestaurantInteraction(tenant.id, 'consent_accept');
    };

    const handleContact = (method: 'whatsapp' | 'call', item?: MenuItem) => {
        if (!consent) return;
        if (!tenant) return;

        if (method === 'whatsapp') {
            logRestaurantInteraction(tenant.id, 'whatsapp_click');
            const msg = locale === 'ar'
                ? `مرحباً، أود الطلب من ${tenant.name.ar}${item ? `: ${item.name.ar}` : ''}`
                : `Hello, I want to order from ${tenant.name.en}${item ? `: ${item.name.en}` : ''}`;
            window.open(`https://wa.me/${tenant.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
            logRestaurantInteraction(tenant.id, 'call_click');
            window.location.href = `tel:${tenant.phone}`;
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">Loading...</div>;
    if (!tenant) return <div className="min-h-screen bg-black flex items-center justify-center text-white/50">Restaurant Not Found</div>;

    return (
        <div className={`min-h-screen bg-black text-white ${isRtl ? 'font-cairo' : 'font-inter'}`} dir={isRtl ? "rtl" : "ltr"}>
            {!consent && (
                <ConsentModal
                    locale={locale}
                    privacyText={tenant.settings.privacyText[locale]}
                    onAccept={handleAccept}
                    onCancel={() => window.history.back()}
                />
            )}

            {/* Premium Header */}
            <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl border border-white/10 overflow-hidden">
                            {/* In real use, use Image from next/image */}
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">LOGO</div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{tenant.name[locale]}</h1>
                            <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                {locale === 'ar' ? 'مفتوح الآن' : 'Open Now'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleContact('call')}
                        className="h-12 w-12 md:w-auto md:px-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-bold"
                    >
                        <Phone size={18} />
                        <span className="hidden md:inline">{locale === 'ar' ? 'اتصل الآن' : 'Call Now'}</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 pb-32">
                {/* Visual Intro */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                {locale === 'ar' ? 'أفضل الأطباق' : 'Best Flavors'} <br />
                                <span className="text-primary">{locale === 'ar' ? 'بلمسة أصلية' : 'With Authentic Touch'}</span>
                            </h2>
                            <div className="flex flex-wrap gap-4 text-zinc-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" />
                                    <span>Riyadh, KSA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-primary" />
                                    <span>10:00 AM - 12:00 PM</span>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-[16/9] bg-zinc-900 rounded-[40px] border border-white/5 relative overflow-hidden">
                            {/* Hero Image would go here */}
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-bold uppercase tracking-widest text-4xl">HERO IMAGE</div>
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">{locale === 'ar' ? 'المنيو' : 'The Menu'}</h3>
                        <div className="px-4 py-1.5 bg-zinc-900 rounded-full border border-white/10 text-xs text-zinc-500 font-medium">
                            {tenant.menu.length} {locale === 'ar' ? 'أطباق' : 'Items'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tenant.menu.map(item => (
                            <MenuCard
                                key={item.id}
                                item={item}
                                locale={locale}
                                onOrder={(it) => handleContact('whatsapp', it)}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Conversion Footer (Mobile Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 md:hidden">
                <button
                    onClick={() => handleContact('whatsapp')}
                    className="w-full h-14 bg-primary text-white rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                >
                    <MessageCircle size={24} />
                    {locale === 'ar' ? 'اطلب عبر الواتساب' : 'Order via WhatsApp'}
                </button>
            </div>

            {/* Conversion-First AI Assistant */}
            {tenant.settings.aiEnabled && (
                <RestaurantChat
                    locale={locale}
                    restaurantName={tenant.name[locale]}
                    onContact={handleContact}
                />
            )}
        </div>
    );
}
