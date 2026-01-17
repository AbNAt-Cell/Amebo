'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Loader2 } from 'lucide-react';
import { Note } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export function NotesList({ limit }: { limit?: number }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const url = limit ? `/api/notes?limit=${limit}` : '/api/notes';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#8D1CDF]" />
            </div>
        );
    }

    if (notes.length === 0) {
        return (
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
                    <span className="text-xl">+</span>
                    Create Your First Note
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
                <Link
                    key={note.id}
                    href={`/dashboard/notes/${note.id}`}
                    className="group block p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#181b21] hover:border-[#8D1CDF] dark:hover:border-[#8D1CDF] transition-all bg-gradient-to-br hover:from-white hover:to-[#EEE2F4]/30"
                >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#8D1CDF] transition-colors">
                            {note.title}
                        </h3>
                        <span className="text-xs text-gray-400">
                            {formatRelativeTime(note.updatedAt || note.createdAt)}
                        </span>
                    </div>

                    {note.summary ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 bg-[#EEE2F4] dark:bg-[#8D1CDF]/10 p-2 rounded-lg">
                            ✨ {note.summary}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                            {note.content?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No content'}
                        </p>
                    )}

                    {note.folderId && (
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                                📁 Folder
                            </span>
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
}
