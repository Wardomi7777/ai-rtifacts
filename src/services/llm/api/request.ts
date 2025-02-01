import { LLMConfig, LLMRequest, Message } from './types';
import { LLMAPIError } from './errors';

export async function makeRequest(
  config: LLMConfig,
  messages: Message[],
  options: Partial<LLMRequest> = {}
) {
  try {
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.max_tokens ?? 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new LLMAPIError(
        `API request failed: ${errorData.error?.message || response.statusText}`,
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
      error instanceof Error ? error.message : 'Failed to make API request'
    );
  }
}