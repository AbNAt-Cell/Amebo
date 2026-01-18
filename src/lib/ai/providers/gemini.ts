import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    AIProvider,
    AISummaryResult,
    AIOrganizationResult,
    AITranscriptionResult,
    AIProviderError,
} from './base';

export class GeminiProvider implements AIProvider {
    name = 'gemini' as const;

    private getClient() {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new AIProviderError('GOOGLE_GEMINI_API_KEY is not set', 'gemini');
        }
        return new GoogleGenerativeAI(apiKey);
    }

    async summarize(content: string): Promise<AISummaryResult> {
        try {
            const genAI = this.getClient();
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Analyze this note content and provide a summary in JSON format:
{
  "summary": "2-3 sentence summary",
  "keyPoints": ["key point 1", "key point 2"],
  "actionItems": ["action 1", "action 2"]
}

Note content:
${content}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Gemini');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return {
                summary: parsed.summary || '',
                keyPoints: parsed.keyPoints || [],
                actionItems: parsed.actionItems || [],
            };
        } catch (error) {
            throw new AIProviderError('Failed to summarize content', 'gemini', error);
        }
    }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const genAI = this.getClient();
            const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            throw new AIProviderError('Failed to generate embedding', 'gemini', error);
        }
    }

    async organize(content: string): Promise<AIOrganizationResult> {
        try {
            const genAI = this.getClient();
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Analyze this note and suggest organization in JSON format:
{
  "suggestedFolder": "folder name or null",
  "suggestedTags": ["tag1", "tag2"],
  "topics": ["topic1", "topic2"],
  "urgency": "low|medium|high"
}

Note content:
${content}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Gemini');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return {
                suggestedFolder: parsed.suggestedFolder || null,
                suggestedTags: parsed.suggestedTags || [],
                topics: parsed.topics || [],
                urgency: parsed.urgency || 'low',
            };
        } catch (error) {
            throw new AIProviderError('Failed to organize content', 'gemini', error);
        }
    }

    async chat(
        messages: { role: 'user' | 'assistant'; content: string }[],
        context?: string
    ): Promise<string> {
        try {
            const genAI = this.getClient();
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const systemPrompt = context
                ? `You are Amebo AI, a note-taking assistant. Context from user's notes:\n${context}\n\n`
                : 'You are Amebo AI, a helpful note-taking assistant.\n\n';

            const conversationHistory = messages
                .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');

            const result = await model.generateContent(systemPrompt + conversationHistory);
            return result.response.text();
        } catch (error) {
            throw new AIProviderError('Failed to generate chat response', 'gemini', error);
        }
    }
    async transcribe(audio: Buffer, mimeType: string): Promise<AITranscriptionResult> {
        try {
            const genAI = this.getClient();
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const audioBase64 = audio.toString('base64');

            const prompt = `Transcribe this audio file accurately. Also provide the language and estimated duration in seconds. Respond in JSON format:
{
  "text": "The transcribed text...",
  "language": "en",
  "duration": 120
}`;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: audioBase64
                    }
                }
            ]);

            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                // Fallback if JSON parsing fails, just return text
                return {
                    text: text,
                    duration: 0,
                    language: 'en'
                };
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return {
                text: parsed.text || '',
                duration: parsed.duration || 0,
                language: parsed.language || 'en',
            };
        } catch (error) {
            throw new AIProviderError('Failed to transcribe audio', 'gemini', error);
        }
    }
}

export const geminiProvider = new GeminiProvider();
