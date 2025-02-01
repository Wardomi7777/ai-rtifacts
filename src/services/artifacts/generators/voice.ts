import { VoiceArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { ElevenLabsClient } from '../../llm/api/elevenlabs';
import { AudioStorage } from '../../storage/AudioStorage';

export class VoiceGenerator extends BaseArtifactGenerator<VoiceArtifact> {
  readonly type = 'voice' as const;
  private elevenLabsClient: ElevenLabsClient;

  constructor() {
    super();
    this.elevenLabsClient = new ElevenLabsClient();
  }

  async generate(prompt: string): Promise<VoiceArtifact> {
    // Generate natural content and metadata
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `Generate natural speech content and metadata. Convert the request into natural-sounding speech that feels conversational and engaging.

Rules:
1. Use conversational language
2. Keep sentences short and clear
3. Use contractions where natural
4. Include natural pauses with commas
5. Avoid complex vocabulary

Response format:
{
  "content": "string (natural speech)",
  "title": "string (short title)",
  "description": "string (brief description)"
}`
        },
        { role: 'user', content: prompt }
      ]
    });

    const result = JSON.parse(response);

    // Generate speech from the content
    const audioBlob = await this.elevenLabsClient.generateSpeech(result.content);
    
    // Save audio blob and get storage key
    const artifactId = this.generateId();
    const storageKey = await AudioStorage.saveAudio(artifactId, audioBlob);

    return {
      id: artifactId,
      type: this.type,
      title: result.title,
      description: result.description,
      content: result.content,
      audioUrl: storageKey,
      voiceId: 'cgSgspJ2msm6clMCkdW9',
      model: 'eleven_multilingual_v2'
    };
  }
}