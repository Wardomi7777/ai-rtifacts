import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { LayoutArtifact as ILayoutArtifact } from '../../../types/artifacts';

export class LayoutArtifact extends BaseArtifact implements ILayoutArtifact {
  type = 'layout' as const;
  code = {
    html: '',
    css: ''
  };
  preview = {
    lastRendered: new Date().toISOString()
  };
  metadata = {
    theme: 'light' as const,
    responsive: true,
    lastUpdated: new Date().toISOString(),
    tags: []
  };

  validate(): void {
    if (!this.code.html || typeof this.code.html !== 'string') {
      throw new Error('Layout must have valid HTML code');
    }

    if (!this.code.css || typeof this.code.css !== 'string') {
      throw new Error('Layout must have valid CSS code');
    }

    if (this.metadata) {
      if (this.metadata.theme && !['light', 'dark'].includes(this.metadata.theme)) {
        throw new Error('Invalid theme value');
      }

      if (this.metadata.responsive !== undefined && typeof this.metadata.responsive !== 'boolean') {
        throw new Error('Responsive flag must be a boolean');
      }

      if (this.metadata.lastUpdated && isNaN(Date.parse(this.metadata.lastUpdated))) {
        throw new Error('Invalid lastUpdated date format');
      }

      if (this.metadata.tags && !Array.isArray(this.metadata.tags)) {
        throw new Error('Tags must be an array of strings');
      }
    }
  }

  getContent(): string {
    return `${this.code.html}\n\nStyles:\n${this.code.css}`;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}