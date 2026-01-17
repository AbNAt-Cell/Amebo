import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ results: [] });
        }

        // 1. Generate embedding for query
        const embedding = await aiService.generateEmbedding(query);

        // 2. Search database using vector similarity
        // We access the raw supabase client to use rpc
        const { data: results, error } = await supabase.rpc('match_notes', {
            query_embedding: embedding,
            match_threshold: 0.7, // Adjust threshold as needed
            match_count: 10
        });

        if (error) {
            console.error('Supabase search error:', error);
            throw error;
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search notes' },
            { status: 500 }
        );
    }
}
