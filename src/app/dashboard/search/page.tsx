'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Note } from '@/types';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<(Note & { similarity: number })[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        try {
            // Use the semantic search API
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

            if (response.ok) {
                const data = await response.json();
                setResults(data.results);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-[#8D1CDF]" />
                    Semantic Search
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Search your notes using natural language. Try "notes about my meeting with John" instead of just "John".
                </p>
            </div>

            <form onSubmit={handleSearch} className="mb-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181b21] focus:ring-2 focus:ring-[#8D1CDF] focus:border-transparent outline-none text-lg"
                />
                <button
                    type="submit"
                    disabled={searching || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#8D1CDF] hover:bg-[#7316b5] text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                    {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                </button>
            </form>

            <div className="space-y-4">
                {results.map((item) => (
                    <Link
                        key={item.id}
                        href={`/dashboard/notes/${item.id}`}
                        className="block p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#181b21] hover:border-[#8D1CDF] dark:hover:border-[#8D1CDF] transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#8D1CDF] transition-colors">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 rounded bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 text-[#8D1CDF] font-medium">
                                    {Math.round(item.similarity * 100)}% Match
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatRelativeTime(item.updatedAt || item.createdAt)}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.content?.replace(/<[^>]*>/g, '').slice(0, 200)}
                        </p>
                    </Link>
                ))}

                {!searching && results.length === 0 && query && (
                    <div className="text-center py-12 text-gray-500">
                        No results found. Try rephrasing your search.
                    </div>
                )}
            </div>
        </div>
    );
}
