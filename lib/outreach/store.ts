import { Lead } from "./types";
import { qualifyLead } from "./scoring";

const STORAGE_KEY = 'zivra_crm_leads';

export function getLeads(): Lead[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function saveLeads(leads: Lead[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function addLead(rawLead: Omit<Lead, 'id' | 'status' | 'score' | 'priority' | 'createdAt' | 'history'>): Lead {
    const newLead: Lead = {
        ...rawLead,
        id: `lead_${Date.now()}`,
        status: 'new',
        score: 0,
        priority: 'low',
        createdAt: new Date().toISOString(),
        history: {
            outreachAttempts: 0
        }
    } as Lead;

    const scoredLead = qualifyLead(newLead);
    const existing = getLeads();
    saveLeads([scoredLead, ...existing]);
    return scoredLead;
}

export function updateLeadStatus(id: string, status: Lead['status'], notes?: string) {
    const leads = getLeads();
    const updated = leads.map(l => {
        if (l.id === id) {
            return {
                ...l,
                status,
                history: {
                    ...l.history,
                    notes: notes || l.history.notes,
                    ...(status === 'contacted' ? { lastContactedAt: new Date().toISOString() } : {}),
                    ...(status === 'replied' ? { lastRepliedAt: new Date().toISOString() } : {}),
                }
            };
        }
        return l;
    });
    saveLeads(updated);
}
