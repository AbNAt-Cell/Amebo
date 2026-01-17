'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, Shield, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(data);
        }
        setLoading(false);
    };

    const handleUpgrade = async (plan: 'pro' | 'team') => {
        setIsUpgrading(true);
        try {
            const response = await fetch('/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan,
                    provider: 'paystack', // Force Paystack for now as per config
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to start checkout');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout');
        } finally {
            setIsUpgrading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    const currentTier = profile?.subscription_tier || 'free';

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Billing & Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Manage your subscription plan and payment methods.
            </p>

            {/* Current Plan */}
            <div className="bg-white dark:bg-[#181b21] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h2>
                        <p className="text-gray-500">
                            You are currently on the <span className="font-bold capitalize">{currentTier}</span> plan.
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 text-[#8D1CDF] rounded-lg font-medium capitalize">
                        {currentTier}
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pro Plan */}
                <div className={`rounded-2xl border p-6 ${currentTier === 'pro' ? 'border-[#8D1CDF] bg-[#EEE2F4]/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181b21]'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro Plan</h3>
                            <p className="text-gray-500">For power users</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">$12</div>
                            <div className="text-sm text-gray-500">/month</div>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500" /> Unlimited Notes
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500" /> Advanced AI Summaries
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500" /> Audio Transcription
                        </li>
                    </ul>

                    <button
                        onClick={() => handleUpgrade('pro')}
                        disabled={currentTier === 'pro' || isUpgrading}
                        className={`w-full py-3 rounded-xl font-medium transition-all ${currentTier === 'pro'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#8D1CDF] hover:bg-[#7316b5] text-white'
                            }`}
                    >
                        {currentTier === 'pro' ? 'Current Plan' : isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
                    </button>
                </div>

                {/* Team Plan */}
                <div className={`rounded-2xl border p-6 ${currentTier === 'team' ? 'border-[#8D1CDF] bg-[#EEE2F4]/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181b21]'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team Plan</h3>
                            <p className="text-gray-500">For collaboration</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">$29</div>
                            <div className="text-sm text-gray-500">/user/month</div>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500" /> Everything in Pro
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500" /> Admin Dashboard
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500" /> Priority Support
                        </li>
                    </ul>

                    <button
                        onClick={() => handleUpgrade('team')}
                        disabled={currentTier === 'team' || isUpgrading}
                        className={`w-full py-3 rounded-xl font-medium transition-all ${currentTier === 'team'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#8D1CDF] hover:bg-[#7316b5] text-white'
                            }`}
                    >
                        {currentTier === 'team' ? 'Current Plan' : isUpgrading ? 'Processing...' : 'Upgrade to Team'}
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                Payments processed securely via Paystack.
            </div>
        </div>
    );
}
