// Base interface for Payment providers

export interface CheckoutSession {
    id: string;
    url: string;
    provider: PaymentProviderName;
}

export interface Subscription {
    id: string;
    userId: string;
    provider: PaymentProviderName;
    providerId: string;
    tier: 'free' | 'pro' | 'team' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
}

export interface WebhookResult {
    event: string;
    userId?: string;
    subscriptionId?: string;
    tier?: string;
    success: boolean;
}

export interface PaymentProvider {
    name: string;

    /**
     * Create a checkout session for a subscription plan
     */
    createCheckout(plan: string, userId: string, email: string): Promise<CheckoutSession>;

    /**
     * Handle webhook events from the payment provider
     */
    handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;

    /**
     * Get the customer portal URL for subscription management
     */
    getCustomerPortalUrl(customerId: string): Promise<string>;

    /**
     * Cancel a subscription
     */
    cancelSubscription(subscriptionId: string): Promise<void>;

    /**
     * Get subscription details
     */
    getSubscription(subscriptionId: string): Promise<Subscription | null>;
}

export type PaymentProviderName = 'stripe' | 'paystack';

export class PaymentProviderError extends Error {
    constructor(
        message: string,
        public provider: PaymentProviderName,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'PaymentProviderError';
    }
}
