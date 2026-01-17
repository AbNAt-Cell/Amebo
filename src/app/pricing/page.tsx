import Link from 'next/link';
import { Check, X, Sparkles, Zap, Users, Building2 } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 font-sans">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob bg-[#8D1CDF] w-96 h-96 -top-20 -left-24 animate-pulse" />
                <div className="blob bg-[#FCE7F3] w-80 h-80 bottom-0 -right-24 dark:opacity-20" />
            </div>

            <Navbar />

            <main className="relative pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                            Simple, transparent pricing
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Start free and upgrade as you grow. No hidden fees, cancel anytime.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Free Plan */}
                        <PricingCard
                            name="Free"
                            description="Perfect for getting started with AI-powered notes"
                            price="$0"
                            period="forever"
                            icon={<Sparkles className="w-6 h-6" />}
                            features={[
                                { text: 'Up to 50 notes', included: true },
                                { text: '50 AI summaries/month', included: true },
                                { text: 'Basic semantic search', included: true },
                                { text: 'Mobile app access', included: true },
                                { text: 'Audio transcription', included: false },
                                { text: 'Team collaboration', included: false },
                                { text: 'Priority support', included: false },
                                { text: 'API access', included: false },
                            ]}
                            ctaText="Get Started Free"
                            ctaHref="/signup"
                            popular={false}
                        />

                        {/* Pro Plan */}
                        <PricingCard
                            name="Pro"
                            description="For professionals who need more power"
                            price="$12"
                            period="/month"
                            icon={<Zap className="w-6 h-6" />}
                            features={[
                                { text: 'Unlimited notes', included: true },
                                { text: '500 AI operations/month', included: true },
                                { text: 'Advanced semantic search', included: true },
                                { text: 'Audio transcription', included: true },
                                { text: 'Auto-organization', included: true },
                                { text: 'Export to PDF/Word', included: true },
                                { text: 'Priority support', included: true },
                                { text: 'API access', included: false },
                            ]}
                            ctaText="Start 14-day Trial"
                            ctaHref="/signup?plan=pro"
                            popular={true}
                        />

                        {/* Team Plan */}
                        <PricingCard
                            name="Team"
                            description="For teams that need collaboration"
                            price="$29"
                            period="/user/month"
                            icon={<Users className="w-6 h-6" />}
                            features={[
                                { text: 'Everything in Pro', included: true },
                                { text: 'Unlimited AI operations', included: true },
                                { text: 'Team collaboration', included: true },
                                { text: 'Shared workspaces', included: true },
                                { text: 'Admin dashboard', included: true },
                                { text: 'Team analytics', included: true },
                                { text: 'API access', included: true },
                                { text: 'Custom integrations', included: true },
                            ]}
                            ctaText="Start Team Trial"
                            ctaHref="/signup?plan=team"
                            popular={false}
                        />
                    </div>

                    {/* Enterprise CTA */}
                    <div className="bg-gradient-to-br from-[#EEE2F4] to-white dark:from-[#181b21] dark:to-[#0f1115] border border-[#EEE2F4] dark:border-gray-800 rounded-2xl p-8 md:p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#8D1CDF] flex items-center justify-center text-white">
                                <Building2 className="w-6 h-6" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Enterprise
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                            Need custom solutions? We offer SSO, HIPAA compliance, custom data retention,
                            dedicated support, and more for large organizations.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                        >
                            Contact Sales
                        </Link>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <FAQItem
                                question="Can I change plans later?"
                                answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate accordingly."
                            />
                            <FAQItem
                                question="What happens when I hit my AI limit?"
                                answer="We'll notify you when you're approaching your limit. You can upgrade anytime or wait for the next billing cycle when your quota resets."
                            />
                            <FAQItem
                                question="Is there a free trial for paid plans?"
                                answer="Yes, both Pro and Team plans come with a 14-day free trial. No credit card required to start."
                            />
                            <FAQItem
                                question="What payment methods do you accept?"
                                answer="We accept all major credit cards through Stripe, and Paystack for African currencies (NGN, GHS, ZAR)."
                            />
                            <FAQItem
                                question="Can I cancel anytime?"
                                answer="Absolutely. You can cancel your subscription at any time from your account settings. No questions asked."
                            />
                            <FAQItem
                                question="Do you offer refunds?"
                                answer="We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Pricing Card Component
function PricingCard({
    name,
    description,
    price,
    period,
    icon,
    features,
    ctaText,
    ctaHref,
    popular,
}: {
    name: string;
    description: string;
    price: string;
    period: string;
    icon: React.ReactNode;
    features: { text: string; included: boolean }[];
    ctaText: string;
    ctaHref: string;
    popular: boolean;
}) {
    return (
        <div
            className={`relative rounded-2xl p-8 ${popular
                    ? 'bg-[#8D1CDF] text-white shadow-2xl shadow-[#8D1CDF]/30 scale-105'
                    : 'bg-white dark:bg-[#181b21] border border-gray-200 dark:border-gray-800'
                }`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                </div>
            )}

            <div className={`w-12 h-12 rounded-xl ${popular ? 'bg-white/20' : 'bg-[#EEE2F4] dark:bg-[#8D1CDF]/20'} flex items-center justify-center mb-4`}>
                <span className={popular ? 'text-white' : 'text-[#8D1CDF]'}>{icon}</span>
            </div>

            <h3 className={`text-xl font-bold mb-1 ${popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {name}
            </h3>
            <p className={`text-sm mb-4 ${popular ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                {description}
            </p>

            <div className="mb-6">
                <span className={`text-4xl font-extrabold ${popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {price}
                </span>
                <span className={popular ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}>
                    {period}
                </span>
            </div>

            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                            <Check className={`w-5 h-5 ${popular ? 'text-white' : 'text-[#8D1CDF]'}`} />
                        ) : (
                            <X className={`w-5 h-5 ${popular ? 'text-white/40' : 'text-gray-300 dark:text-gray-600'}`} />
                        )}
                        <span className={`text-sm ${feature.included
                                ? popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                                : popular ? 'text-white/40' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>

            <Link
                href={ctaHref}
                className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${popular
                        ? 'bg-white text-[#8D1CDF] hover:bg-gray-100'
                        : 'bg-[#8D1CDF] text-white hover:bg-[#7316b5]'
                    }`}
            >
                {ctaText}
            </Link>
        </div>
    );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-white dark:bg-[#181b21] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{question}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
    );
}
