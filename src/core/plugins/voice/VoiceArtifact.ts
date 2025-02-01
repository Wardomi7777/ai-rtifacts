import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { VoiceArtifact as IVoiceArtifact } from '../../../types/artifacts';

export class VoiceArtifact extends BaseArtifact implements IVoiceArtifact {
  type = 'voice' as const;
  content = '';
  audioUrl = '';
  voiceId = '';
  model = '';

  validate(): void {
    if (!this.content || typeof this.content !== 'string') {
      throw new Error('Voice content must be a non-empty string');
    }

    if (!this.audioUrl || typeof this.audioUrl !== 'string') {
      throw new Error('Audio URL must be a non-empty string');
    }

    if (!this.voiceId || typeof this.voiceId !== 'string') {
      throw new Error('Voice ID must be a non-empty string');
    }

    if (!this.model || typeof this.model !== 'string') {
      throw new Error('Model must be a non-empty string');
    }
  }

  getContent(): string {
    return `Generated voice content: ${this.content}`;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}