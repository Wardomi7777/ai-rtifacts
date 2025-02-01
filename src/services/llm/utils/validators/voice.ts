import { VoiceArtifact } from '../../../../types/artifacts';

export function validateVoiceArtifact(data: VoiceArtifact): void {
  if (!data.content || typeof data.content !== 'string') {
    throw new Error('Voice artifact must have content');
  }

  if (!data.audioUrl || typeof data.audioUrl !== 'string') {
    throw new Error('Voice artifact must have an audio URL');
  }

  if (!data.voiceId || typeof data.voiceId !== 'string') {
    throw new Error('Voice artifact must have a voice ID');
  }

  if (!data.model || typeof data.model !== 'string') {
    throw new Error('Voice artifact must have a model specified');
  }
}