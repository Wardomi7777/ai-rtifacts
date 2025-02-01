import { BasePlugin } from '../BasePlugin';
import { LayoutArtifact } from './LayoutArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class LayoutPlugin extends BasePlugin {
  metadata = {
    id: 'core.layout',
    name: 'Layout Plugin',
    version: '1.0.0',
    description: 'Core plugin for layout artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'layout';

  createArtifact(): LayoutArtifact {
    return new LayoutArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        if (!data.code?.html || typeof data.code.html !== 'string') {
          throw new Error('Layout must have valid HTML code');
        }

        if (!data.code?.css || typeof data.code.css !== 'string') {
          throw new Error('Layout must have valid CSS code');
        }

        if (data.metadata) {
          if (data.metadata.theme && !['light', 'dark'].includes(data.metadata.theme)) {
            throw new Error('Invalid theme value');
          }

          if (data.metadata.responsive !== undefined && typeof data.metadata.responsive !== 'boolean') {
            throw new Error('Responsive flag must be a boolean');
          }

          if (data.metadata.lastUpdated) {
            this.validateDateString(data.metadata.lastUpdated, 'lastUpdated');
          }

          if (data.metadata.tags && !Array.isArray(data.metadata.tags)) {
            throw new Error('Tags must be an array of strings');
          }
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        code: {
          type: 'object',
          properties: {
            html: {
              type: 'string',
              description: 'HTML markup'
            },
            css: {
              type: 'string',
              description: 'CSS styles'
            }
          },
          required: ['html', 'css']
        },
        metadata: {
          type: 'object',
          properties: {
            theme: {
              type: 'string',
              enum: ['light', 'dark']
            },
            responsive: {
              type: 'boolean',
              default: true
            },
            tags: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      },
      required: ['code']
    };
  }

  getExportFormats(): string[] {
    return ['html', 'react', 'vue', 'svelte'];
  }

  async beforeCreate(data: Partial<LayoutArtifact>): Promise<Partial<LayoutArtifact>> {
    // Add default metadata if not provided
    if (!data.metadata) {
      data.metadata = {
        theme: 'light',
        responsive: true,
        lastUpdated: new Date().toISOString(),
        tags: []
      };
    }
    return data;
  }

  async afterCreate(artifact: LayoutArtifact): Promise<void> {
    // Generate title from first heading if not provided
    if (!artifact.title) {
      const headingMatch = artifact.code.html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (headingMatch) {
        artifact.title = headingMatch[1].replace(/<[^>]+>/g, '');
      }
    }

    // Update preview timestamp
    artifact.preview = {
      lastRendered: new Date().toISOString()
    };
  }
}