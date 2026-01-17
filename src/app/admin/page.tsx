'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    CreditCard,
    FileText,
    Activity,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalNotes: 0,
        aiUsage: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const supabase = createClient();

        // In a real app, these would be aggregated queries or a dedicated stats table/view
        // For now, we'll fetch counts. Note: this might be slow for large datasets.

        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: notesCount } = await supabase.from('notes').select('*', { count: 'exact', head: true });

        // Mocking subscription and AI usage stats as they require complex queries or we have limited data
        setStats({
            totalUsers: usersCount || 0,
            activeSubscriptions: Math.floor((usersCount || 0) * 0.2), // Mock: 20% conversion
            totalNotes: notesCount || 0,
            aiUsage: 154 // Mock
        });
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-gray-500">
                    Welcome back, Admin. Here's what's happening today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-[#181b21] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            +12%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.totalUsers}
                    </h3>
                    <p className="text-sm text-gray-500">Total Users</p>
                </div>

                <div className="bg-white dark:bg-[#181b21] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            +5%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.activeSubscriptions}
                    </h3>
                    <p className="text-sm text-gray-500">Active Subscriptions</p>
                </div>

                <div className="bg-white dark:bg-[#181b21] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            +8%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.totalNotes}
                    </h3>
                    <p className="text-sm text-gray-500">Total Notes</p>
                </div>

                <div className="bg-white dark:bg-[#181b21] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            0%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.aiUsage}
                    </h3>
                    <p className="text-sm text-gray-500">AI Operations Today</p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#181b21] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Signups</h3>
                    <div className="text-center py-8 text-gray-500">
                        No recent signups to display
                    </div>
                </div>

                <div className="bg-white dark:bg-[#181b21] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                    <div className="text-center py-8 text-gray-500">
                        No recent transactions to display
                    </div>
                </div>
            </div>
        </div>
    );
}
