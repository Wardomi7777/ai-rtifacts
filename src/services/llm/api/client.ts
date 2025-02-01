import { LLMConfig, LLMRequest, LLMResponse, Message } from './types';
import { LLMAPIError } from './errors';
import { DEFAULT_CONFIG } from '../config';

export class LLMAPIClient {
  private config: LLMConfig;

  constructor(config: Partial<LLMConfig> = {}) {
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};

    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is not configured');
    }

    this.config = { 
      ...DEFAULT_CONFIG,
      apiKey: apiKeys.openai,
      ...config 
    };
  }

  static validateApiKeys(type: string): boolean {
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};

    switch (type) {
      case 'search':
        return Boolean(apiKeys.perplexity);
      case 'voice':
        return Boolean(apiKeys.elevenlabs);
      default:
        return Boolean(apiKeys.openai);
    }
  }

  private async makeRequest(messages: Message[], options: Partial<LLMRequest> = {}) {
    try {
      const model = options.model || this.config.model;
      const isO1Model = model === 'o1-preview-2024-09-12';
      const requiresJsonResponse = messages.some(msg => 
        msg.role === 'system' && msg.content.toLowerCase().includes('json')
      );
      
      const requestBody = {
        model,
        messages,
        ...(isO1Model 
          ? {} // o1 model doesn't support temperature parameter
          : { temperature: options.temperature ?? 0.3 }
        ),
        ...(isO1Model 
          ? { max_completion_tokens: options.max_tokens ?? 4000 }
          : { max_tokens: options.max_tokens ?? 4000 }
        ),
        ...(requiresJsonResponse && !isO1Model
          ? { response_format: { type: "json_object" } }
          : {})
      };

      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new LLMAPIError(
          `API request failed: ${errorData.error?.message || response.statusText}`,
          response.status,
          response
        );
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new LLMAPIError('Invalid response format from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof LLMAPIError) {
        throw error;
      }
      throw new LLMAPIError(
        error instanceof Error ? error.message : 'Failed to make API request'
      );
    }
  }

  async complete(request: LLMRequest): Promise<string> {
    // If chat instructions are provided, add them to the system message
    if (request.chatInstructions) {
      request.messages = [
        {
          role: 'system',
          content: request.chatInstructions
        },
        ...request.messages
      ];
    }
    return this.makeRequest(request.messages, request);
  }
}