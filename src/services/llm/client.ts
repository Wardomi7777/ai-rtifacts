import { LLMConfig, LLMRequest, LLMResponse } from './types';
import { LLM_CONFIG } from './config';

export class LLMClient {
  private config: LLMConfig;

  constructor(config: Partial<LLMConfig> = {}) {
    this.config = { ...LLM_CONFIG, ...config };
  }

  async complete(request: LLMRequest): Promise<string> {
    try {
      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`);
      }

      const data: LLMResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('LLM request failed:', error);
      throw error;
    }
  }
}