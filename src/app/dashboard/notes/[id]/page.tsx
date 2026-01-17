'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Sparkles,
    FolderOpen,
    Tag,
    MoreHorizontal,
    Loader2,
    Trash2,
} from 'lucide-react';
import { NoteEditor } from '@/components/editor';
import { formatRelativeTime } from '@/lib/utils';
import { Note } from '@/types';

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchNote();
    }, [id]);

    const fetchNote = async () => {
        try {
            const response = await fetch(`/api/notes/${id}`);
            if (!response.ok) throw new Error('Failed to fetch note');
            const data = await response.json();
            setNote(data);
            setTitle(data.title);
            setContent(data.content || '');
        } catch (error) {
            console.error('Error:', error);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (!response.ok) throw new Error('Failed to update note');

            const updatedNote = await response.json();
            setNote(updatedNote);
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleSummarize = async () => {
        if (!content.trim()) return;

        setSummarizing(true);
        try {
            const response = await fetch('/api/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                const newSummary = data.summary;

                // Save the summary to the note
                await fetch(`/api/notes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ summary: newSummary }),
                });

                // Update local state
                setNote(prev => prev ? { ...prev, summary: newSummary } : null);
            }
        } catch (error) {
            console.error('Failed to summarize:', error);
        } finally {
            setSummarizing(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#8D1CDF]" />
            </div>
        );
    }

    if (!note) return null;

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
                        className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder:text-gray-400"
                    />
                    <span className="text-sm text-gray-400">
                        {saving ? 'Saving...' : 'Saved'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSummarize}
                        disabled={summarizing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#8D1CDF] bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 hover:bg-[#EEE2F4]/80 transition-all disabled:opacity-50"
                    >
                        {summarizing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        <span className="font-medium">Summarize</span>
                    </button>

                    <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                        <Trash2 className="w-5 h-5" />
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
                    {note.summary && (
                        <div className="mb-6 bg-gradient-to-br from-[#EEE2F4] to-white dark:from-[#8D1CDF]/20 dark:to-[#181b21] border border-[#EEE2F4] dark:border-[#8D1CDF]/30 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-[#8D1CDF]" />
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    AI Summary
                                </h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                {note.summary}
                            </p>
                        </div>
                    )}

                    {/* Editor */}
                    <NoteEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your note..."
                    />
                </div>
            </div>
        </div>
    );
}
