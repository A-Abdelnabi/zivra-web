export type LeadStatus = 'new' | 'scored' | 'contacted' | 'replied' | 'demo' | 'converted' | 'archived';
export type LeadPriority = 'high' | 'medium' | 'low';
export type OutreachChannel = 'whatsapp' | 'email' | 'linkedin';

export interface Lead {
    id: string;
    name: string;
    city: string;
    contact: {
        phone?: string;
        whatsapp?: string;
        email?: string;
    };
    socials: {
        instagram?: string;
        website?: string;
    };
    source: 'google_maps' | 'instagram' | 'manual' | 'website';
    status: LeadStatus;
    priority: LeadPriority;
    score: number; // 0-100
    qualification: {
        hasWebsite: boolean;
        hasOrdering: boolean;
        hasWhatsApp: boolean;
        estimatedSize: 'small' | 'medium' | 'large';
    };
    history: {
        lastContactedAt?: string;
        lastRepliedAt?: string;
        outreachAttempts: number;
        notes?: string;
    };
    createdAt: string;
}

export interface OutreachAnalytics {
    sent: number;
    replies: number;
    demos: number;
    conversions: number;
}
