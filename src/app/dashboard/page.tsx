import Link from 'next/link';
import { Plus, FileText, Clock, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { NotesList } from '@/components/notes';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch recent notes (this would come from database once set up)
    // For now, show empty state
    const recentNotes: { id: string; title: string; updatedAt: Date; preview: string }[] = [];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Here&apos;s what&apos;s happening with your notes
                    </p>
                </div>
                <Link
                    href="/dashboard/notes/new"
                    className="flex items-center gap-2 bg-[#8D1CDF] hover:bg-[#7316b5] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#8D1CDF]/20"
                >
                    <Plus className="w-5 h-5" />
                    New Note
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Notes"
                    value="0"
                    subtitle="notes created"
                    icon={<FileText className="w-6 h-6" />}
                    color="purple"
                />
                <StatsCard
                    title="AI Summaries"
                    value="0/50"
                    subtitle="used this month"
                    icon={<Sparkles className="w-6 h-6" />}
                    color="pink"
                />
                <StatsCard
                    title="This Week"
                    value="0"
                    subtitle="notes added"
                    icon={<Clock className="w-6 h-6" />}
                    color="mint"
                />
            </div>

            {/* Recent Notes */}
            <div className="bg-white dark:bg-[#181b21] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Notes
                </h2>

                {recentNotes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-[#8D1CDF]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No notes yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Create your first note to get started with AI-powered note-taking
                        </p>
                        <Link
                            href="/dashboard/notes/new"
                            className="inline-flex items-center gap-2 bg-[#8D1CDF] hover:bg-[#7316b5] text-white px-6 py-3 rounded-xl font-semibold transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Note
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentNotes.map((note) => (
                            <Link
                                key={note.id}
                                href={`/dashboard/notes/${note.id}`}
                                className="block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {note.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {note.preview}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickActionCard
                    title="Transcribe Audio"
                    description="Upload audio and let AI convert it to notes"
                    href="/dashboard/transcribe"
                    icon="🎙️"
                    color="cream"
                />
                <QuickActionCard
                    title="Ask AI Assistant"
                    description="Get help finding or understanding your notes"
                    href="/dashboard/assistant"
                    icon="🤖"
                    color="lilac"
                />
            </div>
        </div>
    );
}

function StatsCard({
    title,
    value,
    subtitle,
    icon,
    color,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    color: 'purple' | 'pink' | 'mint';
}) {
    const colors = {
        purple: 'bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 text-[#8D1CDF]',
        pink: 'bg-[#FCE7F3] dark:bg-pink-500/20 text-pink-500',
        mint: 'bg-[#E4F5DB] dark:bg-emerald-500/20 text-emerald-500',
    };

    return (
        <div className="bg-white dark:bg-[#181b21] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function QuickActionCard({
    title,
    description,
    href,
    icon,
    color,
}: {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: 'cream' | 'lilac';
}) {
    const colors = {
        cream: 'bg-[#FFF6E7] dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20',
        lilac: 'bg-[#EEE2F4] dark:bg-[#8D1CDF]/10 border-[#EEE2F4] dark:border-[#8D1CDF]/20',
    };

    return (
        <Link
            href={href}
            className={`block p-6 rounded-2xl border ${colors[color]} hover:scale-[1.02] transition-all`}
        >
            <span className="text-3xl">{icon}</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </Link>
    );
}
