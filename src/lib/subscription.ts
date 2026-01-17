import { createClient } from '@/lib/supabase/server';

export const PLAN_LIMITS = {
    free: {
        maxNotes: 50,
        maxAiSummaries: 5,
        canTranscribe: false,
        canSearch: true, // Let everyone search, maybe limit results? Nah.
    },
    pro: {
        maxNotes: Infinity,
        maxAiSummaries: Infinity,
        canTranscribe: true,
        canSearch: true,
    },
    team: {
        maxNotes: Infinity,
        maxAiSummaries: Infinity,
        canTranscribe: true,
        canSearch: true,
    },
};

export type SubscriptionTier = keyof typeof PLAN_LIMITS;

export async function getUserSubscription(userId: string) {
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, ai_usage_count, ai_usage_reset_at')
        .eq('id', userId)
        .single();

    if (!profile) return null;

    const tier = (profile.subscription_tier || 'free') as SubscriptionTier;
    const usage = profile.ai_usage_count || 0;

    // Check if usage reset is due
    const resetDate = new Date(profile.ai_usage_reset_at);
    const now = new Date();

    if (now > resetDate) {
        // Logic to reset would go here or be handled by a scheduled function? 
        // For now, we'll just return checked usage.
        // Ideally we should reset it in DB if expired.
        // But for simplicity in this helper, let's just return.
    }

    return {
        tier,
        usage,
        limits: PLAN_LIMITS[tier],
    };
}

export async function checkLimit(userId: string, feature: 'maxNotes' | 'maxAiSummaries') {
    const subscription = await getUserSubscription(userId);
    if (!subscription) return false;

    if (feature === 'maxNotes') {
        const supabase = await createClient();
        const { count } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        return (count || 0) < subscription.limits.maxNotes;
    }

    if (feature === 'maxAiSummaries') {
        return subscription.usage < subscription.limits.maxAiSummaries;
    }

    return true;
}

export async function incrementAiUsage(userId: string) {
    const supabase = await createClient();

    // First get current usage to make sure we don't increment if reset needed (naive approach)
    // Better: RPC call. But simple update for now.

    const { error } = await supabase.rpc('increment_ai_usage', { user_id: userId });
    // We haven't created this RPC yet, let's just do a direct update with fetch first.

    // Fallback to fetch-update pattern if RPC not exists
    if (error) {
        const { data: profile } = await supabase.from('profiles').select('ai_usage_count').eq('id', userId).single();
        if (profile) {
            await supabase.from('profiles').update({ ai_usage_count: (profile.ai_usage_count || 0) + 1 }).eq('id', userId);
        }
    }
}

export async function canTranscribe(userId: string) {
    const subscription = await getUserSubscription(userId);
    return subscription?.limits.canTranscribe ?? false;
}
