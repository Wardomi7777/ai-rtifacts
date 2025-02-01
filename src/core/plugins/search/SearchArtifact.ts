import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { SearchArtifact as ISearchArtifact } from '../../../types/artifacts';

export class SearchArtifact extends BaseArtifact implements ISearchArtifact {
  type = 'search' as const;
  content = '';
  sources: Array<{
    title: string;
    url: string;
    snippet?: string;
  }> = [];

  validate(): void {
    if (!this.content || typeof this.content !== 'string') {
      throw new Error('Search content must be a non-empty string');
    }

    if (!Array.isArray(this.sources)) {
      throw new Error('Sources must be an array');
    }

    this.sources.forEach((source, index) => {
      if (!source.title) {
        throw new Error(`Source at index ${index} must have a title`);
      }
      if (!source.url || !this.isValidUrl(source.url)) {
        throw new Error(`Source at index ${index} must have a valid URL`);
      }
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getContent(): string {
    const sourcesText = this.sources
      .map(s => `${s.title}\n${s.url}${s.snippet ? '\n' + s.snippet : ''}`)
      .join('\n\n');
    return `${this.content}\n\nSources:\n${sourcesText}`;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}