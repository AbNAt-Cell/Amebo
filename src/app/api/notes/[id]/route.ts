import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/notes/[id] - Get a single note
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: note, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (error) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        return NextResponse.json(
            { error: 'Failed to fetch note' },
            { status: 500 }
        );
    }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await request.json();
        const { title, content, summary, folderId, isArchived } = json;

        const updates: any = {
            updated_at: new Date().toISOString(),
        };

        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;
        if (summary !== undefined) updates.summary = summary;
        if (folderId !== undefined) updates.folder_id = folderId;
        if (isArchived !== undefined) updates.is_archived = isArchived;

        const { data: note, error } = await supabase
            .from('notes')
            .update(updates)
            .eq('id', params.id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Update embedding if content or title changed
        if (title !== undefined || content !== undefined) {
            (async () => {
                try {
                    // Fetch current note if we only have partial update
                    const textToEmbed = `${title || note.title}\n\n${content || note.content || ''}`;

                    if (textToEmbed.length > 20) {
                        const { aiService } = await import('@/lib/ai');
                        const embedding = await aiService.generateEmbedding(textToEmbed);

                        await supabase
                            .from('note_embeddings')
                            .upsert({
                                note_id: note.id,
                                embedding,
                                updated_at: new Date().toISOString(),
                            });
                    }
                } catch (err) {
                    console.error('Failed to update embedding:', err);
                }
            })();
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        return NextResponse.json(
            { error: 'Failed to update note' },
            { status: 500 }
        );
    }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}
