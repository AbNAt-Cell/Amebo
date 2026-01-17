import Stripe from 'stripe';
import {
    PaymentProvider,
    CheckoutSession,
    Subscription,
    WebhookResult,
    PaymentProviderError,
} from './base';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

// Stripe price IDs - these should match your Stripe dashboard
const PRICE_IDS = {
    pro: process.env.STRIPE_PRICE_PRO || 'price_pro_monthly',
    team: process.env.STRIPE_PRICE_TEAM || 'price_team_monthly',
};

export class StripeProvider implements PaymentProvider {
    name = 'stripe' as const;

    async createCheckout(plan: string, userId: string, email: string): Promise<CheckoutSession> {
        try {
            const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
            if (!priceId) {
                throw new Error(`Invalid plan: ${plan}`);
            }

            const session = await stripe.checkout.sessions.create({
                customer_email: email,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=canceled`,
                metadata: {
                    userId,
                    plan,
                },
            });

            return {
                id: session.id,
                url: session.url!,
                provider: 'stripe',
            };
        } catch (error) {
            throw new PaymentProviderError('Failed to create checkout session', 'stripe', error);
        }
    }

    async handleWebhook(payload: string, signature: string): Promise<WebhookResult> {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );

            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object as Stripe.Checkout.Session;
                    return {
                        event: 'checkout.completed',
                        userId: session.metadata?.userId,
                        subscriptionId: session.subscription as string,
                        tier: session.metadata?.plan,
                        success: true,
                    };
                }
                case 'customer.subscription.updated': {
                    const subscription = event.data.object as Stripe.Subscription;
                    return {
                        event: 'subscription.updated',
                        subscriptionId: subscription.id,
                        success: true,
                    };
                }
                case 'customer.subscription.deleted': {
                    const subscription = event.data.object as Stripe.Subscription;
                    return {
                        event: 'subscription.canceled',
                        subscriptionId: subscription.id,
                        success: true,
                    };
                }
                default:
                    return { event: event.type, success: true };
            }
        } catch (error) {
            throw new PaymentProviderError('Failed to handle webhook', 'stripe', error);
        }
    }

    async getCustomerPortalUrl(customerId: string): Promise<string> {
        try {
            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
            });
            return session.url;
        } catch (error) {
            throw new PaymentProviderError('Failed to create customer portal', 'stripe', error);
        }
    }

    async cancelSubscription(subscriptionId: string): Promise<void> {
        try {
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });
        } catch (error) {
            throw new PaymentProviderError('Failed to cancel subscription', 'stripe', error);
        }
    }

    async getSubscription(subscriptionId: string): Promise<Subscription | null> {
        try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);

            // Determine tier from price ID
            let tier: 'free' | 'pro' | 'team' | 'enterprise' = 'free';
            const priceId = sub.items.data[0]?.price.id;
            if (priceId === PRICE_IDS.pro) tier = 'pro';
            if (priceId === PRICE_IDS.team) tier = 'team';

            return {
                id: sub.id,
                userId: '', // Would need to look up from metadata
                provider: 'stripe',
                providerId: sub.id,
                tier,
                status: sub.status === 'active' ? 'active' :
                    sub.status === 'trialing' ? 'trialing' :
                        sub.status === 'past_due' ? 'past_due' : 'canceled',
                currentPeriodStart: new Date(sub.current_period_start * 1000),
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
                cancelAtPeriodEnd: sub.cancel_at_period_end,
            };
        } catch (error) {
            throw new PaymentProviderError('Failed to get subscription', 'stripe', error);
        }
    }
}

export const stripeProvider = new StripeProvider();
