"use client";

import * as React from "react";
import { RestaurantTenant, Locale } from "@/lib/restaurant/types";
import { getTenantBySlug } from "@/lib/restaurant/data";
import { BarChart3, Settings, Menu as MenuIcon, Eye, MessageCircle, Phone, Save } from "lucide-react";

export default function TenantAdmin({ slug, locale }: { slug: string; locale: Locale }) {
    const [tenant, setTenant] = React.useState<RestaurantTenant | null>(null);
    const [loading, setLoading] = React.useState(true);
    const isRtl = locale === 'ar';

    React.useEffect(() => {
        getTenantBySlug(slug).then(data => {
            setTenant(data);
            setLoading(false);
        });
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">Loading Admin...</div>;
    if (!tenant) return <div className="min-h-screen bg-black flex items-center justify-center text-white/50">Admin Access Denied</div>;

    const stats = [
        { label: locale === 'ar' ? 'نقرات الواتساب' : 'WhatsApp Orders', val: '42', icon: MessageCircle, color: 'text-green-500' },
        { label: locale === 'ar' ? 'المكالمات' : 'Calls', val: '12', icon: Phone, color: 'text-primary' },
        { label: locale === 'ar' ? 'مشاهدات المنيو' : 'Menu Views', val: '256', icon: Eye, color: 'text-blue-500' },
        { label: locale === 'ar' ? 'طلبات مكتملة' : 'Conversion Rate', val: '14%', icon: BarChart3, color: 'text-purple-500' },
    ];

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${isRtl ? 'font-cairo' : 'font-inter'}`} dir={isRtl ? "rtl" : "ltr"}>
            {/* Admin Header */}
            <header className="h-20 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-bold">A</div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Admin Panel</h2>
                        <p className="text-xs text-zinc-500">{tenant.name[locale]}</p>
                    </div>
                </div>
                <button className="h-10 px-6 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all">
                    <Save size={14} />
                    {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map(s => (
                        <div key={s.label} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl">
                            <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${s.color}`}>
                                <s.icon size={20} />
                            </div>
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">{s.label}</p>
                            <h3 className="text-2xl font-black">{s.val}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Settings Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-zinc-900/50 border border-white/5 p-8 rounded-[32px]">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                                <Settings className="text-primary" size={20} />
                                {locale === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{locale === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
                                    <input defaultValue={tenant.whatsapp} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:border-primary/50 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{locale === 'ar' ? 'نص الخصوصية' : 'Privacy Text (PDPL)'}</label>
                                    <textarea defaultValue={tenant.settings.privacyText[locale]} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors resize-none" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-sm font-medium">{locale === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}</span>
                                    <div className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors ${tenant.settings.aiEnabled ? 'bg-primary' : 'bg-zinc-700'}`}>
                                        <div className={`h-4 w-4 bg-white rounded-full transition-transform ${tenant.settings.aiEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Menu Management Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-zinc-900/50 border border-white/5 p-8 rounded-[32px]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold flex items-center gap-3">
                                    <MenuIcon className="text-primary" size={20} />
                                    {locale === 'ar' ? 'إدارة المنيو' : 'Menu Management'}
                                </h3>
                                <button className="h-10 px-4 rounded-xl border border-primary/30 text-primary text-xs font-bold hover:bg-primary/10 transition-all">
                                    + {locale === 'ar' ? 'إضافة صنف' : 'Add Item'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {tenant.menu.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="h-12 w-12 rounded-xl bg-zinc-800 overflow-hidden relative border border-white/5">
                                            {item.image && <img src={item.image} alt="" className="object-cover h-full w-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold">{item.name[locale]}</h4>
                                            <p className="text-xs text-zinc-500">{item.price} SAR</p>
                                        </div>
                                        <button className="h-10 px-4 rounded-xl bg-zinc-800 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:text-primary">
                                            {locale === 'ar' ? 'تعديل' : 'Edit'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
