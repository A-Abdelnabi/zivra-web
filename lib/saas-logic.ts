/**
 * Phase E: Referral & Logic Helpers
 */

export interface ReferralReward {
    clientId: string;
    referredCount: number;
    rewardMonths: number;
    nextTierUpgrade: boolean;
}

export function calculateReferralBenefits(referredCount: number): Partial<ReferralReward> {
    return {
        rewardMonths: referredCount, // 1 per client
        nextTierUpgrade: referredCount >= 3, // Unlock upgrade for 1 month if >= 3
    };
}

/**
 * Retention Trigger: 14-day check
 */
export function isRetentionWindowReached(activeDays: number): boolean {
    return activeDays >= 14;
}

/**
 * Partner Commission Logic
 */
export const PARTNER_COMMISSION_RATE = 0.25; // 25% recurring

export function calculatePartnerPayout(mrr: number): number {
    return mrr * PARTNER_COMMISSION_RATE;
}
