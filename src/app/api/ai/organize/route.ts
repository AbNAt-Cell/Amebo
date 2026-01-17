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

        // Get content to organize
        const { content } = await request.json();

        if (!content || content.trim().length < 20) {
            return NextResponse.json(
                { error: 'Content must be at least 20 characters' },
                { status: 400 }
            );
        }

        // Strip HTML tags
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        // Get organization suggestions from AI
        const organization = await aiService.organize(plainText);

        return NextResponse.json(organization);
    } catch (error) {
        console.error('Organization error:', error);
        return NextResponse.json(
            { error: 'Failed to generate organization suggestions' },
            { status: 500 }
        );
    }
}
