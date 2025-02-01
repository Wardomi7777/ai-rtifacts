import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { DiagramArtifact as IDiagramArtifact } from '../../../types/artifacts';

export class DiagramArtifact extends BaseArtifact implements IDiagramArtifact {
  type = 'diagram' as const;
  notation = 'mermaid' as const;
  source = '';

  validate(): void {
    if (!this.source || typeof this.source !== 'string') {
      throw new Error('Diagram source must be a non-empty string');
    }
  }

  getContent(): string {
    return this.source;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}