import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get content to summarize
        const { content } = await request.json();

        if (!content || content.trim().length < 50) {
            return NextResponse.json(
                { error: 'Content must be at least 50 characters' },
                { status: 400 }
            );
        }

        // Check AI limits
        const { checkLimit, incrementAiUsage } = await import('@/lib/subscription');
        const canSummarize = await checkLimit(user.id, 'maxAiSummaries');

        if (!canSummarize) {
            return NextResponse.json(
                { error: 'AI summary limit reached (5/month). Please upgrade to Pro.' },
                { status: 403 }
            );
        }

        // Strip HTML tags for summarization
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        // Generate summary using the AI service
        const summary = await aiService.summarize(plainText);

        // Increment usage
        await incrementAiUsage(user.id);

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Summarization error:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}
