// Base interface for AI providers
// All providers must implement this interface

export interface AISummaryResult {
    summary: string;
    keyPoints: string[];
    actionItems: string[];
}

export interface AIOrganizationResult {
    suggestedFolder: string | null;
    suggestedTags: string[];
    topics: string[];
    urgency: 'low' | 'medium' | 'high';
}

export interface AISearchResult {
    noteId: string;
    title: string;
    relevanceScore: number;
    matchedContent: string;
}

export interface AITranscriptionResult {
    text: string;
    duration: number;
    language: string;
}

export interface AIProvider {
    name: string;

    /**
     * Summarize note content
     */
    summarize(content: string): Promise<AISummaryResult>;

    /**
     * Generate embedding vector for semantic search
     */
    generateEmbedding(text: string): Promise<number[]>;

    /**
     * Analyze content and suggest organization
     */
    organize(content: string): Promise<AIOrganizationResult>;

    /**
     * Transcribe audio to text (optional - not all providers support this)
     */
    transcribe?(audio: Buffer, mimeType: string): Promise<AITranscriptionResult>;

    /**
     * Chat/answer questions about notes
     */
    chat(messages: { role: 'user' | 'assistant'; content: string }[], context?: string): Promise<string>;
}

export type AIProviderName = 'openai' | 'gemini' | 'anthropic' | 'grok';

export class AIProviderError extends Error {
    constructor(
        message: string,
        public provider: AIProviderName,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'AIProviderError';
    }
}
