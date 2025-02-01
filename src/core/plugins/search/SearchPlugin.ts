import { BasePlugin } from '../BasePlugin';
import { SearchArtifact } from './SearchArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class SearchPlugin extends BasePlugin {
  metadata = {
    id: 'core.search',
    name: 'Search Plugin',
    version: '1.0.0',
    description: 'Core plugin for search artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'search';

  createArtifact(): SearchArtifact {
    return new SearchArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredString(data.content, 'content');
        
        if (!Array.isArray(data.sources)) {
          throw new Error('Sources must be an array');
        }

        data.sources.forEach((source: any, index: number) => {
          if (!source.title) {
            throw new Error(`Source at index ${index} must have a title`);
          }
          if (!source.url || !this.isValidUrl(source.url)) {
            throw new Error(`Source at index ${index} must have a valid URL`);
          }
        });
      }
    ];
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Search results summary'
        },
        sources: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              url: { type: 'string', format: 'uri' },
              snippet: { type: 'string' }
            },
            required: ['title', 'url']
          }
        }
      },
      required: ['content', 'sources']
    };
  }

  getExportFormats(): string[] {
    return ['json', 'markdown', 'html'];
  }

  async beforeCreate(data: Partial<SearchArtifact>): Promise<Partial<SearchArtifact>> {
    // Ensure sources array exists
    if (!data.sources) {
      data.sources = [];
    }
    return data;
  }

  async afterCreate(artifact: SearchArtifact): Promise<void> {
    // Generate title from content if not provided
    if (!artifact.title && artifact.content) {
      const firstLine = artifact.content.split('\n')[0];
      artifact.title = firstLine.length > 50
        ? firstLine.slice(0, 47) + '...'
        : firstLine;
    }
  }
}