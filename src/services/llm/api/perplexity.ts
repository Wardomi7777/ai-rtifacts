import { LLMAPIError } from './errors';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations: string[];
}

export class PerplexityClient {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};
    this.apiKey = apiKeys.perplexity || '';
  }

  async search(query: string): Promise<PerplexityResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Perplexity API key is required for search functionality');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{
            role: 'user',
            content: query
          }],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new LLMAPIError(
          `Perplexity API request failed: ${response.statusText}`,
          response.status,
          response
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof LLMAPIError) {
        throw error;
      }
      throw new LLMAPIError(
        error instanceof Error ? error.message : 'Failed to make Perplexity API request'
      );
    }
  }
}