import { BasePlugin } from '../BasePlugin';
import { DocumentArtifact } from './DocumentArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class DocumentPlugin extends BasePlugin {
  metadata = {
    id: 'core.document',
    name: 'Document Plugin',
    version: '1.0.0',
    description: 'Core plugin for document artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'document';

  createArtifact(): DocumentArtifact {
    return new DocumentArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredString(data.content, 'content');
        
        if (data.format !== 'markdown') {
          throw new Error('Document format must be markdown');
        }

        if (data.style) {
          const { theme, fontSize, lineHeight } = data.style;
          
          if (theme && !['default', 'academic', 'technical'].includes(theme)) {
            throw new Error('Invalid theme value');
          }
          
          if (fontSize && !['normal', 'large'].includes(fontSize)) {
            throw new Error('Invalid fontSize value');
          }
          
          if (lineHeight && !['normal', 'relaxed', 'loose'].includes(lineHeight)) {
            throw new Error('Invalid lineHeight value');
          }
        }

        if (data.metadata) {
          if (data.metadata.lastUpdated) {
            this.validateDateString(data.metadata.lastUpdated, 'lastUpdated');
          }
          
          if (data.metadata.tags && !Array.isArray(data.metadata.tags)) {
            throw new Error('Tags must be an array');
          }
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Markdown content with placeholders'
        },
        style: {
          type: 'object',
          properties: {
            theme: {
              type: 'string',
              enum: ['default', 'academic', 'technical']
            },
            fontSize: {
              type: 'string',
              enum: ['normal', 'large']
            },
            lineHeight: {
              type: 'string',
              enum: ['normal', 'relaxed', 'loose']
            }
          }
        }
      },
      required: ['content']
    };
  }

  getExportFormats(): string[] {
    return ['markdown', 'html', 'pdf', 'docx'];
  }

  async beforeCreate(data: Partial<DocumentArtifact>): Promise<Partial<DocumentArtifact>> {
    // Add default style if not provided
    if (!data.style) {
      data.style = {
        theme: 'default',
        fontSize: 'normal',
        lineHeight: 'normal'
      };
    }
    return data;
  }

  async afterCreate(artifact: DocumentArtifact): Promise<void> {
    // Generate title from content if not provided
    if (!artifact.title) {
      const firstLine = artifact.content.split('\n')[0];
      if (firstLine.startsWith('#')) {
        artifact.title = firstLine.replace(/^#+\s*/, '');
      }
    }
  }
}