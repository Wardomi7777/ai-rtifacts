import { LLMAPIError } from './errors';

export class ElevenLabsClient {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private defaultVoiceId = 'cgSgspJ2msm6clMCkdW9';
  private defaultModel = 'eleven_multilingual_v2';

  constructor() {
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};
    this.apiKey = apiKeys.elevenlabs || '';
  }

  async generateSpeech(
    text: string,
    options: {
      voiceId?: string;
      model?: string;
    } = {}
  ): Promise<Blob> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key is required for voice functionality');
      }

      const voiceId = options.voiceId || this.defaultVoiceId;
      const model = options.model || this.defaultModel;

      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: model,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API request failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      throw new LLMAPIError(
        error instanceof Error ? error.message : 'Failed to generate speech'
      );
    }
  }
}