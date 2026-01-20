"use client";

import * as React from "react";
import LeadList from "@/components/admin/LeadList";
import { getLeads, addLead } from "@/lib/outreach/store";
import { BarChart3, Users, MessageSquare, Target, Upload, Plus } from "lucide-react";

export default function GrowthDashboard({ locale }: { locale: 'ar' | 'en' }) {
    const [stats, setStats] = React.useState({
        total: 0,
        contacted: 0,
        demos: 0,
        converted: 0
    });

    React.useEffect(() => {
        // Initial Mock Data if empty
        const currentLeads = getLeads();
        if (currentLeads.length === 0) {
            addLead({ name: "Riyadh SteakHouse", city: "Riyadh", source: "google_maps", contact: { whatsapp: "9665XXXXXXXX" }, socials: { instagram: "@steakhouse" }, qualification: { hasWebsite: false, hasOrdering: false, hasWhatsApp: false, estimatedSize: "medium" } });
            addLead({ name: "Jeddah Burger", city: "Jeddah", source: "instagram", contact: { whatsapp: "9665XXXXXXXX" }, socials: { instagram: "@j_burger" }, qualification: { hasWebsite: true, hasOrdering: false, hasWhatsApp: true, estimatedSize: "small" } });
            addLead({ name: "Al Baik Chain", city: "Jeddah", source: "manual", contact: { phone: "9665XXXXXXXX" }, socials: { website: "albaik.com" }, qualification: { hasWebsite: true, hasOrdering: true, hasWhatsApp: true, estimatedSize: "large" } });
        }

        const leads = getLeads();
        setStats({
            total: leads.length,
            contacted: leads.filter(l => ['contacted', 'replied', 'demo', 'converted'].includes(l.status)).length,
            demos: leads.filter(l => ['demo', 'converted'].includes(l.status)).length,
            converted: leads.filter(l => l.status === 'converted').length
        });
    }, []);

    const statCards = [
        { label: 'Total Leads', val: stats.total, sub: 'All regions', icon: Users, color: 'text-zinc-400' },
        { label: 'Contacted', val: stats.contacted, sub: 'WhatsApp/Email', icon: MessageSquare, color: 'text-orange-400' },
        { label: 'Demos Viewed', val: stats.demos, sub: 'High Intent', icon: Target, color: 'text-blue-400' },
        { label: 'Conversions', val: stats.converted, sub: 'Paying Clients', icon: BarChart3, color: 'text-primary' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-inter">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Growth Automation</h1>
                    <p className="text-zinc-500 mt-1">Saudi Restaurant Outreach & CRM</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                        <Upload size={14} /> Import CSV
                    </button>
                    <button className="h-12 px-6 rounded-2xl bg-primary text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20">
                        <Plus size={14} /> Add Lead
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {statCards.map(s => (
                    <div key={s.label} className="bg-zinc-900/50 border border-white/5 p-8 rounded-[40px] relative overflow-hidden group">
                        <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${s.color}`}>
                            <s.icon size={24} />
                        </div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{s.label}</p>
                        <h3 className="text-3xl font-black">{s.val}</h3>
                        <p className="text-[10px] text-zinc-600 mt-2 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Recent Leads</h2>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest border border-white/5 bg-white/5 px-4 py-1.5 rounded-full">
                        Live Funnel Tracking
                    </div>
                </div>
                <LeadList locale={locale === 'ar' ? 'ar' : 'en'} />
            </section>
        </div>
    );
}
