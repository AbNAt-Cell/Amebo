import { Sidebar } from '@/components/layout/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    return (
        <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#0f1115]">
            <Sidebar
                user={{
                    name: profile?.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    avatarUrl: profile?.avatar_url,
                }}
            />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
