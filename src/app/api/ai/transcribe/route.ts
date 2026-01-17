import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Check Plan Permission
        const { canTranscribe } = await import('@/lib/subscription');
        const allowed = await canTranscribe(user.id);

        if (!allowed) {
            return NextResponse.json(
                { error: 'Audio transcription is a Pro feature. Please upgrade.' },
                { status: 403 }
            );
        }

        // Check file size (limit to 10MB due to serverless limits, ideally user should upload to storage first)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const mimeType = file.type || 'audio/webm'; // Default for MediaRecorder

        const result = await aiService.transcribe(buffer, mimeType);

        // Save as a new note automatically
        const { data: note, error } = await supabase
            .from('notes')
            .insert({
                user_id: user.id,
                title: `Transcription ${new Date().toLocaleString()}`,
                content: result.text,
                summary: `Audio transcription (${Math.round(result.duration)}s) - ${result.language}`,
            })
            .select()
            .single();

        return NextResponse.json({
            transcription: result,
            noteId: note?.id,
        });
    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { error: 'Failed to transcribe audio' },
            { status: 500 }
        );
    }
}
