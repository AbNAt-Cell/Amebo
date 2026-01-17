import {
    AIProvider,
    AIProviderName,
    AISummaryResult,
    AIOrganizationResult,
    AITranscriptionResult,
    AIProviderError,
    openaiProvider,
    geminiProvider,
    anthropicProvider,
    grokProvider,
} from './providers';

// Provider registry
const providers: Record<AIProviderName, AIProvider> = {
    openai: openaiProvider,
    gemini: geminiProvider,
    anthropic: anthropicProvider,
    grok: grokProvider,
};

// Default embedding provider (used when main provider doesn't support embeddings)
const embeddingProviders: AIProviderName[] = ['openai', 'gemini'];

/**
 * AI Service Manager
 * Manages AI provider selection and provides a unified interface
 */
class AIService {
    private activeProvider: AIProviderName = 'openai';

    /**
     * Set the active AI provider
     */
    setProvider(provider: AIProviderName) {
        if (!providers[provider]) {
            throw new Error(`Unknown AI provider: ${provider}`);
        }
        this.activeProvider = provider;
    }

    /**
     * Get the current active provider
     */
    getProvider(): AIProviderName {
        return this.activeProvider;
    }

    /**
     * Get the provider instance
     */
    getProviderInstance(): AIProvider {
        return providers[this.activeProvider];
    }

    /**
     * Summarize content using the active provider
     */
    async summarize(content: string): Promise<AISummaryResult> {
        return providers[this.activeProvider].summarize(content);
    }

    /**
     * Generate embedding for semantic search
     * Falls back to OpenAI/Gemini if active provider doesn't support embeddings
     */
    async generateEmbedding(text: string): Promise<number[]> {
        // Try the active provider first
        if (embeddingProviders.includes(this.activeProvider)) {
            return providers[this.activeProvider].generateEmbedding(text);
        }

        // Fall back to OpenAI for embeddings
        console.log(`[AI Service] ${this.activeProvider} doesn't support embeddings, falling back to OpenAI`);
        return providers.openai.generateEmbedding(text);
    }

    /**
     * Organize and categorize content
     */
    async organize(content: string): Promise<AIOrganizationResult> {
        return providers[this.activeProvider].organize(content);
    }

    /**
     * Transcribe audio to text
     * Only OpenAI supports this currently
     */
    async transcribe(audio: Buffer, mimeType: string): Promise<AITranscriptionResult> {
        const provider = providers[this.activeProvider];
        if (provider.transcribe) {
            return provider.transcribe(audio, mimeType);
        }

        // Fall back to OpenAI for transcription
        console.log(`[AI Service] ${this.activeProvider} doesn't support transcription, falling back to OpenAI`);
        if (providers.openai.transcribe) {
            return providers.openai.transcribe(audio, mimeType);
        }

        throw new AIProviderError('No transcription service available', this.activeProvider);
    }

    /**
     * Chat with AI assistant
     */
    async chat(
        messages: { role: 'user' | 'assistant'; content: string }[],
        context?: string
    ): Promise<string> {
        return providers[this.activeProvider].chat(messages, context);
    }

    /**
     * Get all available providers
     */
    getAvailableProviders(): AIProviderName[] {
        return Object.keys(providers) as AIProviderName[];
    }
}

// Export singleton instance
export const aiService = new AIService();

// Re-export types
export type { AIProvider, AIProviderName, AISummaryResult, AIOrganizationResult, AITranscriptionResult };
export { AIProviderError };
