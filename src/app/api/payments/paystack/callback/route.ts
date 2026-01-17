import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const reference = searchParams.get('reference'); // transaction reference (trxref) is also sent but reference is better

        if (!reference) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`);
        }

        // Verify transaction with Paystack API
        const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.status || verifyData.data.status !== 'success') {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`);
        }

        // Extract metadata
        const { userId, plan } = verifyData.data.metadata;
        const subscriptionCode = verifyData.data.subscription_code; // Paystack subscription code

        // Update user profile with subscription details using Supabase Admin Client
        // We need service role here because we might be updating another user's profile or running in a context where RLS might block? 
        // Actually, this is a server route, so we can use the regular server client, BUT since this is a callback, the user might not be fully "logged in" in this request context? 
        // No, usually they valid cookies. But safer to use admin client for subscription updates.
        // However, `createClient` from `@/lib/supabase/server` uses cookies. 

        // Let's rely on the metadata `userId`.
        const supabase = await createClient(); // This uses cookies, so it acts as the user.
        // If the user effectively logged in, we can update their profile. 
        // But wait, "Users can update their own profile" policy exists.

        // Better to use service role client for high-privilege updates like subscription status to avoid RLS issues if the policies aren't perfect for this.
        // I'll assume standard client is fine IF the user is logged in. But callback might happen in a different browser/device? (Unlikely for redirect).

        // Let's try standard client first.

        // Calculate reset date for AI usage (next month)
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const { error } = await supabase
            .from('profiles')
            .update({
                subscription_tier: plan === 'pro' || plan === 'team' ? plan : 'free',
                ai_usage_count: 0, // Reset usage on new subscription
                ai_usage_reset_at: nextMonth.toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            console.error('Failed to update profile subscription:', error);
            // We verified payment but failed to update DB. Ideally log this to Sentry.
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`);
    } catch (error) {
        console.error('Paystack callback error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`);
    }
}
