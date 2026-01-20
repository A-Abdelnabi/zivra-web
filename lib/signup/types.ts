export type BusinessType = 'restaurant' | 'cafe' | 'other';
export type ServiceIntent = 'ordering' | 'whatsapp' | 'menu' | 'marketing' | 'help';

export interface SignupState {
    step: number;
    businessType: BusinessType;
    intent: ServiceIntent;
    source?: string;
    lang: 'ar' | 'en';

    // Step 2 Info
    businessName: string;
    city: string;
    whatsapp: string;
    email: string;
    consent: boolean;

    // Step 3 Plan
    selectedPlanId: string;
    paymentMode: 'now' | 'later';

    // Status
    loading: boolean;
    error?: string;
}

export const INITIAL_SIGNUP_STATE: SignupState = {
    step: 1,
    businessType: 'restaurant',
    intent: 'ordering',
    lang: 'en',
    businessName: '',
    city: '',
    whatsapp: '',
    email: '',
    consent: false,
    selectedPlanId: 'growth',
    paymentMode: 'later',
    loading: false
};
