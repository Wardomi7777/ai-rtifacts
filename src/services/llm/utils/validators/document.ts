import { DocumentArtifact } from '../../../../types/artifacts';

export function validateDocumentArtifact(data: DocumentArtifact): void {
  if (data.format !== 'markdown') {
    throw new Error('Document format must be "markdown"');
  }
  if (typeof data.content !== 'string' || !data.content.trim()) {
    throw new Error('Document content must be a non-empty string');
  }
}