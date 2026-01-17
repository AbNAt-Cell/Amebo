'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Sparkles,
    FolderOpen,
    Tag,
    MoreHorizontal,
    Loader2,
} from 'lucide-react';
import { NoteEditor } from '@/components/editor';

export default function NewNotePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [summary, setSummary] = useState<{
        summary: string;
        keyPoints: string[];
        actionItems: string[];
    } | null>(null);
    const router = useRouter();

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    summary: summary?.summary,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save note');
            }

            const note = await response.json();

            router.push(`/dashboard/notes/${note.id}`);
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save note. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSummarize = async () => {
        if (!content.trim()) {
            alert('Please add some content first');
            return;
        }

        setSummarizing(true);
        try {
            const response = await fetch('/api/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data);
            }
        } catch (error) {
            console.error('Failed to summarize:', error);
        } finally {
            setSummarizing(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181b21]">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Note"
                        className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSummarize}
                        disabled={summarizing || !content.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#8D1CDF] bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 hover:bg-[#EEE2F4]/80 transition-all disabled:opacity-50"
                    >
                        {summarizing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        <span className="font-medium">Summarize</span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <FolderOpen className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <Tag className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#8D1CDF] hover:bg-[#7316b5] text-white rounded-xl font-medium transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>Save</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {/* AI Summary Panel */}
                    {summary && (
                        <div className="mb-6 bg-gradient-to-br from-[#EEE2F4] to-white dark:from-[#8D1CDF]/20 dark:to-[#181b21] border border-[#EEE2F4] dark:border-[#8D1CDF]/30 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-[#8D1CDF]" />
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    AI Summary
                                </h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {summary.summary}
                            </p>

                            {summary.keyPoints.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Key Points
                                    </h4>
                                    <ul className="space-y-1">
                                        {summary.keyPoints.map((point, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-[#8D1CDF]">•</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {summary.actionItems.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Action Items
                                    </h4>
                                    <ul className="space-y-1">
                                        {summary.actionItems.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-emerald-500">☐</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Editor */}
                    <NoteEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your note... Use the toolbar above for formatting."
                    />
                </div>
            </div>
        </div>
    );
}
