import { Lead, LeadPriority } from "./types";

export function calculateLeadScore(lead: Partial<Lead>): { score: number; priority: LeadPriority } {
    let score = 0;

    // 1. Digital Presence (Negative correlation with SaaS need = High Score)
    if (!lead.qualification?.hasWebsite) score += 20;
    if (!lead.qualification?.hasOrdering) score += 30;
    if (!lead.qualification?.hasWhatsApp) score += 15;

    // 2. Business Size (Weighted for scalability)
    switch (lead.qualification?.estimatedSize) {
        case 'large': score += 35; break; // Chain / Enterprise
        case 'medium': score += 20; break;
        case 'small': score += 10; break;
    }

    // 3. Completeness of Data
    if (lead.contact?.whatsapp) score += 10;
    if (lead.socials?.instagram) score += 5;

    // Caps
    score = Math.min(score, 100);

    // Prioritization
    let priority: LeadPriority = 'low';
    if (score >= 65) priority = 'high';
    else if (score >= 35) priority = 'medium';

    return { score, priority };
}

export function qualifyLead(lead: Lead): Lead {
    const { score, priority } = calculateLeadScore(lead);
    return {
        ...lead,
        score,
        priority,
        status: 'scored'
    };
}
