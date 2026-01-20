"use client";

import * as React from "react";
import { Lead } from "@/lib/outreach/types";
import { getLeads, updateLeadStatus, addLead } from "@/lib/outreach/store";
import { triggerOutreach, handleResponse } from "@/lib/outreach/automation";
import { MessageCircle, Mail, MoreVertical, Trash2, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function LeadList({ locale }: { locale: 'ar' | 'en' }) {
    const [leads, setLeads] = React.useState<Lead[]>([]);
    const [filter, setFilter] = React.useState<Lead['status'] | 'all'>('all');
    const isRtl = locale === 'ar';

    React.useEffect(() => {
        setLeads(getLeads());
    }, []);

    const handleSend = async (lead: Lead, channel: 'whatsapp' | 'email') => {
        const success = await triggerOutreach(lead, channel);
        if (success) setLeads(getLeads());
    };

    const handleSimulateReply = async (lead: Lead, positive: boolean) => {
        await handleResponse(lead, positive);
        setLeads(getLeads());
    };

    const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

    const getStatusColor = (status: Lead['status']) => {
        switch (status) {
            case 'converted': return 'text-green-400 bg-green-400/10';
            case 'demo': return 'text-blue-400 bg-blue-400/10';
            case 'replied': return 'text-purple-400 bg-purple-400/10';
            case 'contacted': return 'text-orange-400 bg-orange-400/10';
            default: return 'text-zinc-400 bg-zinc-400/10';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {['all', 'new', 'scored', 'contacted', 'replied', 'demo', 'converted'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${filter === s ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {filteredLeads.map(lead => (
                    <div key={lead.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px] hover:border-white/10 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center font-bold text-lg text-primary">
                                    {lead.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white">{lead.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                        {lead.priority === 'high' && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-tighter bg-red-500/10 px-2 py-0.5 rounded-full">
                                                <AlertCircle size={10} /> High Priority
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">{lead.city} • Score: <span className="text-primary font-bold">{lead.score}</span></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {lead.status === 'scored' || lead.status === 'new' ? (
                                    <>
                                        <button
                                            onClick={() => handleSend(lead, 'whatsapp')}
                                            className="h-10 px-4 rounded-xl bg-green-600/10 text-green-500 text-xs font-bold flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all"
                                        >
                                            <MessageCircle size={14} /> WhatsApp
                                        </button>
                                        <button
                                            onClick={() => handleSend(lead, 'email')}
                                            className="h-10 px-4 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                                        >
                                            <Mail size={14} /> Email
                                        </button>
                                    </>
                                ) : lead.status === 'contacted' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSimulateReply(lead, true)}
                                            className="text-[10px] font-bold text-zinc-500 hover:text-green-500 transition-colors"
                                        >
                                            Simulate Positive Reply
                                        </button>
                                        <button
                                            onClick={() => handleSimulateReply(lead, false)}
                                            className="text-[10px] font-bold text-zinc-500 hover:text-red-500 transition-colors"
                                        >
                                            Not Interested
                                        </button>
                                    </div>
                                ) : lead.status === 'demo' ? (
                                    <button
                                        onClick={() => updateLeadStatus(lead.id, 'converted')}
                                        className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                                    >
                                        <CheckCircle2 size={14} /> Convert to SaaS
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredLeads.length === 0 && (
                    <div className="py-20 text-center bg-zinc-900/20 border border-dashed border-white/5 rounded-[40px]">
                        <p className="text-zinc-500 text-sm">No leads found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
