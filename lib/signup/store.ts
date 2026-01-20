import { SignupState, INITIAL_SIGNUP_STATE, ServiceIntent } from "./types";

const STORAGE_KEY = 'zivra_signup_v1';

export function getSignupState(): SignupState {
    if (typeof window === 'undefined') return INITIAL_SIGNUP_STATE;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SIGNUP_STATE;
}

export function saveSignupState(state: SignupState) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSignupState() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
}

/**
 * Logic to determine the best plan based on intent
 */
export function getRecommendedPlan(intent: ServiceIntent): string {
    switch (intent) {
        case 'ordering': return 'growth'; // High intent needs ordering features
        case 'whatsapp': return 'growth';
        case 'marketing': return 'pro';   // Advanced needs Pro
        case 'menu': return 'starter';    // Basic menu needs Starter
        default: return 'growth';
    }
}
