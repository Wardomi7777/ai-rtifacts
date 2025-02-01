import { LLMAPIError } from './errors';

export class WhisperClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/audio/transcriptions';

  constructor() {
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};
    const apiKey = apiKeys.openai;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    this.apiKey = apiKey;
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'json');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new LLMAPIError(
          `Whisper API request failed: ${response.statusText}`,
          response.status,
          response
        );
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      if (error instanceof LLMAPIError) {
        throw error;
      }
      throw new LLMAPIError(
        error instanceof Error ? error.message : 'Failed to transcribe audio'
      );
    }
  }
}