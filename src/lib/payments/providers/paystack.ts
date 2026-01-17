import {
    PaymentProvider,
    CheckoutSession,
    Subscription,
    WebhookResult,
    PaymentProviderError,
} from './base';

// Paystack API base URL
const PAYSTACK_API = 'https://api.paystack.co';

// Plan codes from Paystack dashboard
const PLAN_CODES = {
    pro: process.env.PAYSTACK_PLAN_PRO || 'PLN_pro_monthly',
    team: process.env.PAYSTACK_PLAN_TEAM || 'PLN_team_monthly',
};

async function paystackRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, unknown>
): Promise<T> {
    const response = await fetch(`${PAYSTACK_API}${endpoint}`, {
        method,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!data.status) {
        throw new Error(data.message || 'Paystack API error');
    }
    return data.data;
}

interface PaystackInitializeResponse {
    authorization_url: string;
    access_code: string;
    reference: string;
}

interface PaystackSubscription {
    id: number;
    status: string;
    subscription_code: string;
    email_token: string;
    next_payment_date: string;
    plan: {
        plan_code: string;
        name: string;
    };
}

export class PaystackProvider implements PaymentProvider {
    name = 'paystack' as const;

    async createCheckout(plan: string, userId: string, email: string): Promise<CheckoutSession> {
        try {
            const planCode = PLAN_CODES[plan as keyof typeof PLAN_CODES];
            if (!planCode) {
                throw new Error(`Invalid plan: ${plan}`);
            }

            const data = await paystackRequest<PaystackInitializeResponse>(
                '/transaction/initialize',
                'POST',
                {
                    email,
                    plan: planCode,
                    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paystack/callback`,
                    metadata: {
                        userId,
                        plan,
                    },
                }
            );

            return {
                id: data.reference,
                url: data.authorization_url,
                provider: 'paystack',
            };
        } catch (error) {
            throw new PaymentProviderError('Failed to create checkout session', 'paystack', error);
        }
    }

    async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
        try {
            // Verify webhook signature
            const crypto = await import('crypto');
            const hash = crypto
                .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
                .update(JSON.stringify(payload))
                .digest('hex');

            if (hash !== signature) {
                throw new Error('Invalid webhook signature');
            }

            const event = payload as { event: string; data: Record<string, unknown> };

            switch (event.event) {
                case 'subscription.create':
                case 'charge.success':
                    return {
                        event: 'checkout.completed',
                        userId: (event.data.metadata as Record<string, string>)?.userId,
                        subscriptionId: event.data.subscription_code as string,
                        tier: (event.data.metadata as Record<string, string>)?.plan,
                        success: true,
                    };
                case 'subscription.disable':
                    return {
                        event: 'subscription.canceled',
                        subscriptionId: event.data.subscription_code as string,
                        success: true,
                    };
                default:
                    return { event: event.event, success: true };
            }
        } catch (error) {
            throw new PaymentProviderError('Failed to handle webhook', 'paystack', error);
        }
    }

    async getCustomerPortalUrl(_customerId: string): Promise<string> {
        // Paystack doesn't have a customer portal like Stripe
        // Redirect to our own settings page
        return `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`;
    }

    async cancelSubscription(subscriptionCode: string): Promise<void> {
        try {
            // Get the subscription to find its email token
            const subscription = await paystackRequest<PaystackSubscription>(
                `/subscription/${subscriptionCode}`,
                'GET'
            );

            // Disable the subscription
            await paystackRequest(
                '/subscription/disable',
                'POST',
                {
                    code: subscriptionCode,
                    token: subscription.email_token,
                }
            );
        } catch (error) {
            throw new PaymentProviderError('Failed to cancel subscription', 'paystack', error);
        }
    }

    async getSubscription(subscriptionCode: string): Promise<Subscription | null> {
        try {
            const sub = await paystackRequest<PaystackSubscription>(
                `/subscription/${subscriptionCode}`,
                'GET'
            );

            // Determine tier from plan code
            let tier: 'free' | 'pro' | 'team' | 'enterprise' = 'free';
            if (sub.plan.plan_code === PLAN_CODES.pro) tier = 'pro';
            if (sub.plan.plan_code === PLAN_CODES.team) tier = 'team';

            const nextPayment = new Date(sub.next_payment_date);
            const currentPeriodEnd = nextPayment;
            const currentPeriodStart = new Date(nextPayment);
            currentPeriodStart.setMonth(currentPeriodStart.getMonth() - 1);

            return {
                id: sub.subscription_code,
                userId: '',
                provider: 'paystack',
                providerId: sub.subscription_code,
                tier,
                status: sub.status === 'active' ? 'active' : 'canceled',
                currentPeriodStart,
                currentPeriodEnd,
                cancelAtPeriodEnd: false,
            };
        } catch (error) {
            throw new PaymentProviderError('Failed to get subscription', 'paystack', error);
        }
    }
}

export const paystackProvider = new PaystackProvider();
