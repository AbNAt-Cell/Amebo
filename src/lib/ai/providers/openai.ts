import OpenAI from 'openai';
import {
    AIProvider,
    AISummaryResult,
    AIOrganizationResult,
    AITranscriptionResult,
    AIProviderError,
} from './base';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIProvider implements AIProvider {
    name = 'openai' as const;

    async summarize(content: string): Promise<AISummaryResult> {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant that summarizes notes. Analyze the content and provide:
1. A concise summary (2-3 sentences)
2. Key points (as bullet points)
3. Action items (tasks mentioned or implied)

Respond in JSON format:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "actionItems": ["...", "..."]
}`,
                    },
                    {
                        role: 'user',
                        content,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            const result = JSON.parse(response.choices[0].message.content || '{}');
            return {
                summary: result.summary || '',
                keyPoints: result.keyPoints || [],
                actionItems: result.actionItems || [],
            };
        } catch (error) {
            throw new AIProviderError('Failed to summarize content', 'openai', error);
        }
    }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
            });
            return response.data[0].embedding;
        } catch (error) {
            throw new AIProviderError('Failed to generate embedding', 'openai', error);
        }
    }

    async organize(content: string): Promise<AIOrganizationResult> {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Analyze this note and suggest organization. Provide:
1. A suggested folder name (or null if unclear)
2. Suggested tags (up to 5)
3. Main topics discussed
4. Urgency level (low/medium/high based on deadlines or importance)

Respond in JSON:
{
  "suggestedFolder": "...",
  "suggestedTags": ["..."],
  "topics": ["..."],
  "urgency": "low|medium|high"
}`,
                    },
                    {
                        role: 'user',
                        content,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            const result = JSON.parse(response.choices[0].message.content || '{}');
            return {
                suggestedFolder: result.suggestedFolder || null,
                suggestedTags: result.suggestedTags || [],
                topics: result.topics || [],
                urgency: result.urgency || 'low',
            };
        } catch (error) {
            throw new AIProviderError('Failed to organize content', 'openai', error);
        }
    }

    async transcribe(audio: Buffer, mimeType: string): Promise<AITranscriptionResult> {
        try {
            // Create a File-like object for the API
            const file = new File([audio as any], 'audio.webm', { type: mimeType });

            const response = await openai.audio.transcriptions.create({
                file,
                model: 'whisper-1',
                response_format: 'verbose_json',
            });

            return {
                text: response.text,
                duration: response.duration || 0,
                language: response.language || 'en',
            };
        } catch (error) {
            throw new AIProviderError('Failed to transcribe audio', 'openai', error);
        }
    }

    async chat(
        messages: { role: 'user' | 'assistant'; content: string }[],
        context?: string
    ): Promise<string> {
        try {
            const systemMessage = context
                ? `You are Amebo AI, a helpful assistant for note-taking. Here is the relevant context from the user's notes:\n\n${context}`
                : 'You are Amebo AI, a helpful assistant for note-taking and productivity.';

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemMessage },
                    ...messages,
                ],
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            throw new AIProviderError('Failed to generate chat response', 'openai', error);
        }
    }
}

export const openaiProvider = new OpenAIProvider();
