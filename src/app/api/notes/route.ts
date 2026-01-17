import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/notes - List all notes
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters for filtering
        const searchParams = request.nextUrl.searchParams;
        const folderId = searchParams.get('folderId');
        const isArchived = searchParams.get('isArchived') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabase
            .from('notes')
            .select('id, title, content, summary, updated_at, created_at, is_archived, folder_id')
            .eq('user_id', user.id)
            .eq('is_archived', isArchived)
            .order('updated_at', { ascending: false })
            .limit(limit);

        if (folderId) {
            query = query.eq('folder_id', folderId);
        }

        const { data: notes, error } = await query;

        if (error) {
            throw error;
        }

        // Strip HTML from content for preview if needed on client side, 
        // but sending raw content is fine for now.

        return NextResponse.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await request.json();
        const { title, content, summary, folderId } = json;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Check plan limits
        const { checkLimit } = await import('@/lib/subscription');
        const canCreate = await checkLimit(user.id, 'maxNotes');

        if (!canCreate) {
            return NextResponse.json(
                { error: 'Note limit reached. Please upgrade your plan.' },
                { status: 403 }
            );
        }

        const { data: note, error } = await supabase
            .from('notes')
            .insert({
                user_id: user.id,
                title,
                content: content || '',
                summary,
                folder_id: folderId || null,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Generate and save embedding asynchronously (fire and forget for response speed)
        if (content && content.length > 20) {
            (async () => {
                try {
                    const { aiService } = await import('@/lib/ai');
                    const embedding = await aiService.generateEmbedding(
                        `${title}\n\n${content}`
                    );

                    await supabase
                        .from('note_embeddings')
                        .upsert({
                            note_id: note.id,
                            embedding,
                            updated_at: new Date().toISOString(),
                        });
                } catch (err) {
                    console.error('Failed to generate embedding:', err);
                }
            })();
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        );
    }
}
