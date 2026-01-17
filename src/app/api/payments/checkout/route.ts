import { NextRequest, NextResponse } from 'next/server';
import { paymentService, PaymentProviderName } from '@/lib/payments';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, provider } = await request.json();

        if (!plan || !['pro', 'team'].includes(plan)) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        // Create checkout session
        const session = await paymentService.createCheckout(
            plan,
            user.id,
            user.email!,
            provider as PaymentProviderName
        );

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
