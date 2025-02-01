import { ThinkArtifact } from '../../../../types/artifacts';

export function validateThinkArtifact(data: ThinkArtifact): void {
  if (typeof data.content !== 'string' || !data.content.trim()) {
    throw new Error('Think response must have non-empty content');
  }
}