import OpenAI from 'openai';
import {
    AIProvider,
    AISummaryResult,
    AIOrganizationResult,
    AIProviderError,
} from './base';

// Grok uses OpenAI-compatible API
const grok = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: 'https://api.x.ai/v1',
});

export class GrokProvider implements AIProvider {
    name = 'grok' as const;

    async summarize(content: string): Promise<AISummaryResult> {
        try {
            const response = await grok.chat.completions.create({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: `Summarize the note. Respond in JSON:
{
  "summary": "2-3 sentences",
  "keyPoints": ["point1", "point2"],
  "actionItems": ["action1", "action2"]
}`,
                    },
                    {
                        role: 'user',
                        content,
                    },
                ],
            });

            const text = response.choices[0].message.content || '{}';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');

            return {
                summary: parsed.summary || '',
                keyPoints: parsed.keyPoints || [],
                actionItems: parsed.actionItems || [],
            };
        } catch (error) {
            throw new AIProviderError('Failed to summarize content', 'grok', error);
        }
    }

    async generateEmbedding(_text: string): Promise<number[]> {
        // Grok doesn't have embedding support yet
        throw new AIProviderError(
            'Grok does not support embeddings. Please use OpenAI or Gemini for semantic search.',
            'grok'
        );
    }

    async organize(content: string): Promise<AIOrganizationResult> {
        try {
            const response = await grok.chat.completions.create({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: `Analyze and suggest organization. Respond in JSON:
{
  "suggestedFolder": "folder or null",
  "suggestedTags": ["tag1"],
  "topics": ["topic1"],
  "urgency": "low|medium|high"
}`,
                    },
                    {
                        role: 'user',
                        content,
                    },
                ],
            });

            const text = response.choices[0].message.content || '{}';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');

            return {
                suggestedFolder: parsed.suggestedFolder || null,
                suggestedTags: parsed.suggestedTags || [],
                topics: parsed.topics || [],
                urgency: parsed.urgency || 'low',
            };
        } catch (error) {
            throw new AIProviderError('Failed to organize content', 'grok', error);
        }
    }

    async chat(
        messages: { role: 'user' | 'assistant'; content: string }[],
        context?: string
    ): Promise<string> {
        try {
            const systemMessage = context
                ? `You are Amebo AI. Context from user's notes:\n${context}`
                : 'You are Amebo AI, a note-taking assistant.';

            const response = await grok.chat.completions.create({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: systemMessage },
                    ...messages,
                ],
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            throw new AIProviderError('Failed to generate chat response', 'grok', error);
        }
    }
}

export const grokProvider = new GrokProvider();
