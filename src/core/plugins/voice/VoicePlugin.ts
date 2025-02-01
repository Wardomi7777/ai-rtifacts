import { BasePlugin } from '../BasePlugin';
import { VoiceArtifact } from './VoiceArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';
import { ElevenLabsClient } from '../../../services/llm/api/elevenlabs';
import { AudioStorage } from '../../../services/storage/AudioStorage';

export class VoicePlugin extends BasePlugin {
  metadata = {
    id: 'core.voice',
    name: 'Voice Plugin',
    version: '1.0.0',
    description: 'Core plugin for voice generation artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'voice';
  private elevenLabsClient: ElevenLabsClient;

  constructor() {
    super();
    this.elevenLabsClient = new ElevenLabsClient();
  }

  createArtifact(): VoiceArtifact {
    return new VoiceArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredString(data.content, 'content');
        this.validateRequiredString(data.audioUrl, 'audioUrl');
        this.validateRequiredString(data.voiceId, 'voiceId');
        this.validateRequiredString(data.model, 'model');
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Text to convert to speech'
        },
        voiceId: {
          type: 'string',
          description: 'ElevenLabs voice ID'
        },
        model: {
          type: 'string',
          enum: ['eleven_multilingual_v2'],
          default: 'eleven_multilingual_v2'
        }
      },
      required: ['content']
    };
  }

  getExportFormats(): string[] {
    return ['mp3', 'wav', 'ogg'];
  }

  async beforeCreate(data: Partial<VoiceArtifact>): Promise<Partial<VoiceArtifact>> {
    // Generate audio if content is provided but URL is not
    if (data.content && !data.audioUrl) {
      const audioBlob = await this.elevenLabsClient.generateSpeech(
        data.content,
        {
          voiceId: data.voiceId || 'cgSgspJ2msm6clMCkdW9',
          model: data.model || 'eleven_multilingual_v2'
        }
      );

      // Save audio blob and get storage key
      const artifactId = crypto.randomUUID();
      const storageKey = await AudioStorage.saveAudio(artifactId, audioBlob);

      data.audioUrl = storageKey;
      data.voiceId = data.voiceId || 'cgSgspJ2msm6clMCkdW9';
      data.model = data.model || 'eleven_multilingual_v2';
    }
    return data;
  }

  async afterCreate(artifact: VoiceArtifact): Promise<void> {
    // Generate title from content if not provided
    if (!artifact.title) {
      artifact.title = artifact.content.length > 50
        ? artifact.content.slice(0, 47) + '...'
        : artifact.content;
    }
  }
}