import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { DocumentArtifact as IDocumentArtifact } from '../../../types/artifacts';

export class DocumentArtifact extends BaseArtifact implements IDocumentArtifact {
  type = 'document' as const;
  format = 'markdown' as const;
  content = '';
  style = {
    theme: 'default' as const,
    fontSize: 'normal' as const,
    lineHeight: 'normal' as const
  };

  validate(): void {
    if (!this.content || typeof this.content !== 'string') {
      throw new Error('Document content must be a non-empty string');
    }
  }

  getContent(): string {
    return this.content;
  }

  async transform(targetType: string): Promise<any> {
    // Transform logic will be implemented in the plugin
    throw new Error('Transform not implemented');
  }
}