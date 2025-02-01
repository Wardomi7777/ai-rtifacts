import { OpenAI } from 'openai';
import { LLMAPIError } from './errors';

interface DalleResponse {
  created: number;
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

export class DalleClient {
  private client: OpenAI;

  constructor() {
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};
    const apiKey = apiKeys.openai;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateImage(
    prompt: string,
    options: {
      size?: '1024x1024' | '1792x1024' | '1024x1792';
      quality?: 'standard' | 'hd';
      style?: 'vivid' | 'natural';
    } = {}
  ): Promise<string> {
    try {
      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        ...options,
      });

      if (!response.data?.[0]?.url) {
        throw new Error('No image URL in response');
      }

      return response.data[0].url;
    } catch (error) {
      if (error instanceof LLMAPIError) {
        throw error;
      }
      throw new LLMAPIError(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  }
}