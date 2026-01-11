export interface ChatRequest {
    message: string;
    sessionId?: string;
    context?: {
        page?: string;
        locale?: string;
    };
}

export interface ChatAction {
    type: string;
    payload?: Record<string, any>;
}

export interface ChatResponse {
    role: 'assistant' | 'system';
    content: string;
    actions?: ChatAction[];
}

export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    service?: 'website' | 'app' | 'maintenance' | 'other';
    timestamp: string;
}
