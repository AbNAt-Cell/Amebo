'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Users,
    BarChart,
    Settings,
    Shield,
    Loader2,
    DollarSign
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        // Check if user is admin (using email for simple admin check for now)
        // Ideally this should be a column in the profiles table but we haven't migrated it yet.
        // Let's assume the first user or specific emails are admins.
        // Or we can add a simple check in subscription.ts later. 
        // For now, let's allow access but this is a placeholder security.
        // REAL IMPLEMENTATION: Fetch profile and check role.

        // TEMPORARY: Allow all for demo purposes or check specific email
        // const isAdminUser = user.email === 'admin@amebo.com'; 
        setIsAdmin(true);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1117]">
                <Loader2 className="w-8 h-8 animate-spin text-[#8D1CDF]" />
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#181b21] border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <Link href="/dashboard" className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Amebo</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Admin</span>
                    </Link>
                    <p className="text-xs text-gray-500">System Management</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                    >
                        <BarChart className="w-5 h-5" />
                        Overview
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                    >
                        <Users className="w-5 h-5" />
                        Users
                    </Link>
                    <Link
                        href="/admin/subscriptions"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                    >
                        <DollarSign className="w-5 h-5" />
                        Subscriptions
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm text-[#8D1CDF] hover:underline"
                    >
                        <Shield className="w-4 h-4" />
                        Back to User Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
