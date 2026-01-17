import {
    PaymentProvider,
    PaymentProviderName,
    CheckoutSession,
    Subscription,
    WebhookResult,
    PaymentProviderError,
    stripeProvider,
    paystackProvider,
} from './providers';

// Provider registry
const providers: Record<PaymentProviderName, PaymentProvider> = {
    stripe: stripeProvider,
    paystack: paystackProvider,
};

/**
 * Payment Service Manager
 * Manages payment provider selection and provides unified interface
 */
class PaymentService {
    private activeProvider: PaymentProviderName = 'stripe';
    private enabledProviders: Set<PaymentProviderName> = new Set(['stripe']);

    /**
     * Set the active payment provider
     */
    setProvider(provider: PaymentProviderName) {
        if (!providers[provider]) {
            throw new Error(`Unknown payment provider: ${provider}`);
        }
        this.activeProvider = provider;
    }

    /**
     * Enable a payment provider
     */
    enableProvider(provider: PaymentProviderName) {
        this.enabledProviders.add(provider);
    }

    /**
     * Disable a payment provider
     */
    disableProvider(provider: PaymentProviderName) {
        this.enabledProviders.delete(provider);
    }

    /**
     * Get enabled providers
     */
    getEnabledProviders(): PaymentProviderName[] {
        return Array.from(this.enabledProviders);
    }

    /**
     * Get the current active provider
     */
    getProvider(): PaymentProviderName {
        return this.activeProvider;
    }

    /**
     * Create checkout session
     */
    async createCheckout(
        plan: string,
        userId: string,
        email: string,
        provider?: PaymentProviderName
    ): Promise<CheckoutSession> {
        const selectedProvider = provider || this.activeProvider;
        return providers[selectedProvider].createCheckout(plan, userId, email);
    }

    /**
     * Handle webhook from any provider
     */
    async handleWebhook(
        provider: PaymentProviderName,
        payload: unknown,
        signature: string
    ): Promise<WebhookResult> {
        return providers[provider].handleWebhook(payload, signature);
    }

    /**
     * Get customer portal URL
     */
    async getCustomerPortalUrl(
        customerId: string,
        provider?: PaymentProviderName
    ): Promise<string> {
        const selectedProvider = provider || this.activeProvider;
        return providers[selectedProvider].getCustomerPortalUrl(customerId);
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(
        subscriptionId: string,
        provider?: PaymentProviderName
    ): Promise<void> {
        const selectedProvider = provider || this.activeProvider;
        return providers[selectedProvider].cancelSubscription(subscriptionId);
    }

    /**
     * Get subscription
     */
    async getSubscription(
        subscriptionId: string,
        provider?: PaymentProviderName
    ): Promise<Subscription | null> {
        const selectedProvider = provider || this.activeProvider;
        return providers[selectedProvider].getSubscription(subscriptionId);
    }

    /**
     * Get all available providers
     */
    getAvailableProviders(): PaymentProviderName[] {
        return Object.keys(providers) as PaymentProviderName[];
    }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Re-export types
export type { PaymentProvider, PaymentProviderName, CheckoutSession, Subscription, WebhookResult };
export { PaymentProviderError };
