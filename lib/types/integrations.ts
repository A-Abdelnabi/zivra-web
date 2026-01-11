export interface ChatRequest {
    sessionId: string;
    message: string;
    context?: {
        page?: string;
        locale?: string;
        userAgent?: string;
    };
}

export interface ChatAction {
    type: 'SHOW_PRICING_TIER' | 'OPEN_FORM' | 'NAVIGATE';
    payload?: Record<string, any>;
}

export interface ChatResponse {
    role: 'assistant';
    content: string; // Markdown supported
    actions?: ChatAction[];
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    calories?: number;
    imageUrl?: string;
    available: boolean;
    dietary?: ('vegan' | 'gluten-free' | 'spicy')[];
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface RestaurantMenu {
    restaurantId: string;
    lastUpdated: string; // ISO Date
    currency: string;
    categories: MenuCategory[];
}

export interface WhatsAppMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'location';
    text?: { body: string };
    image?: { id: string; url: string };
}
