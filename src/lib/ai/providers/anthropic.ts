import Anthropic from '@anthropic-ai/sdk';
import {
    AIProvider,
    AISummaryResult,
    AIOrganizationResult,
    AIProviderError,
} from './base';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AnthropicProvider implements AIProvider {
    name = 'anthropic' as const;

    async summarize(content: string): Promise<AISummaryResult> {
        try {
            const message = await anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: `Analyze this note content and provide a summary in JSON format:
{
  "summary": "2-3 sentence summary",
  "keyPoints": ["key point 1", "key point 2"],
  "actionItems": ["action 1", "action 2"]
}

Note content:
${content}`,
                    },
                ],
            });

            const text = message.content[0].type === 'text' ? message.content[0].text : '';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Claude');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return {
                summary: parsed.summary || '',
                keyPoints: parsed.keyPoints || [],
                actionItems: parsed.actionItems || [],
            };
        } catch (error) {
            throw new AIProviderError('Failed to summarize content', 'anthropic', error);
        }
    }

    async generateEmbedding(_text: string): Promise<number[]> {
        // Anthropic doesn't have a native embedding model
        // We'll throw an error suggesting to use OpenAI or Gemini for embeddings
        throw new AIProviderError(
            'Anthropic does not support embeddings. Please use OpenAI or Gemini for semantic search.',
            'anthropic'
        );
    }

    async organize(content: string): Promise<AIOrganizationResult> {
        try {
            const message = await anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: `Analyze this note and suggest organization in JSON format:
{
  "suggestedFolder": "folder name or null",
  "suggestedTags": ["tag1", "tag2"],
  "topics": ["topic1", "topic2"],
  "urgency": "low|medium|high"
}

Note content:
${content}`,
                    },
                ],
            });

            const text = message.content[0].type === 'text' ? message.content[0].text : '';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Claude');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return {
                suggestedFolder: parsed.suggestedFolder || null,
                suggestedTags: parsed.suggestedTags || [],
                topics: parsed.topics || [],
                urgency: parsed.urgency || 'low',
            };
        } catch (error) {
            throw new AIProviderError('Failed to organize content', 'anthropic', error);
        }
    }

    async chat(
        messages: { role: 'user' | 'assistant'; content: string }[],
        context?: string
    ): Promise<string> {
        try {
            const systemPrompt = context
                ? `You are Amebo AI, a note-taking assistant. Here's context from the user's notes:\n${context}`
                : 'You are Amebo AI, a helpful note-taking assistant.';

            const response = await anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 2048,
                system: systemPrompt,
                messages: messages,
            });

            return response.content[0].type === 'text' ? response.content[0].text : '';
        } catch (error) {
            throw new AIProviderError('Failed to generate chat response', 'anthropic', error);
        }
    }
}

export const anthropicProvider = new AnthropicProvider();
