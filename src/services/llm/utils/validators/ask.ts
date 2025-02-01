import { AskArtifact } from '../../../../types/artifacts';

export function validateAskArtifact(data: AskArtifact): void {
  if (typeof data.content !== 'string' || !data.content.trim()) {
    throw new Error('Ask response must have non-empty content');
  }
}