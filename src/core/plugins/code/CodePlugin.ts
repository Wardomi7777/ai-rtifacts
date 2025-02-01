import { BasePlugin } from '../BasePlugin';
import { CodeArtifact } from './CodeArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class CodePlugin extends BasePlugin {
  metadata = {
    id: 'core.code',
    name: 'Code Plugin',
    version: '1.0.0',
    description: 'Core plugin for code artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'code';

  createArtifact(): CodeArtifact {
    return new CodeArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        if (!['javascript', 'python', 'typescript'].includes(data.language)) {
          throw new Error('Invalid programming language');
        }

        this.validateRequiredString(data.source, 'source');

        // Validate inputs if present
        if (data.inputs) {
          if (!Array.isArray(data.inputs)) {
            throw new Error('Inputs must be an array');
          }

          const inputIds = new Set<string>();
          
          data.inputs.forEach((input: any, index: number) => {
            if (!input.id) {
              throw new Error(`Input at index ${index} must have an id`);
            }

            if (inputIds.has(input.id)) {
              throw new Error(`Duplicate input id: ${input.id}`);
            }
            inputIds.add(input.id);

            if (!input.label) {
              throw new Error(`Input at index ${index} must have a label`);
            }

            if (!['text', 'number', 'boolean'].includes(input.type)) {
              throw new Error(`Invalid input type at index ${index}`);
            }

            // Validate default value type if present
            if (input.defaultValue !== undefined) {
              const valueType = typeof input.defaultValue;
              if (input.type === 'number' && valueType !== 'number') {
                throw new Error(`Default value for number input must be a number at index ${index}`);
              }
              if (input.type === 'boolean' && valueType !== 'boolean') {
                throw new Error(`Default value for boolean input must be a boolean at index ${index}`);
              }
              if (input.type === 'text' && valueType !== 'string') {
                throw new Error(`Default value for text input must be a string at index ${index}`);
              }
            }
          });
        }

        // Validate lastResult if present
        if (data.lastResult) {
          if (!data.lastResult.timestamp) {
            throw new Error('Last result must have a timestamp');
          }

          if (!data.lastResult.output && !data.lastResult.error) {
            throw new Error('Last result must have either output or error');
          }

          this.validateDateString(data.lastResult.timestamp, 'lastResult.timestamp');
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          enum: ['javascript', 'python', 'typescript'],
          default: 'javascript'
        },
        source: {
          type: 'string',
          description: 'Source code'
        },
        inputs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              type: {
                type: 'string',
                enum: ['text', 'number', 'boolean']
              },
              defaultValue: {
                oneOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'boolean' }
                ]
              }
            },
            required: ['id', 'label', 'type']
          }
        }
      },
      required: ['language', 'source']
    };
  }

  getExportFormats(): string[] {
    return ['js', 'py', 'ts', 'json'];
  }

  async beforeCreate(data: Partial<CodeArtifact>): Promise<Partial<CodeArtifact>> {
    // Set default language if not provided
    if (!data.language) {
      data.language = 'javascript';
    }
    return data;
  }

  async afterCreate(artifact: CodeArtifact): Promise<void> {
    // Generate title from first line if not provided
    if (!artifact.title) {
      const firstLine = artifact.source.split('\n')[0];
      if (firstLine.startsWith('//') || firstLine.startsWith('#')) {
        artifact.title = firstLine.replace(/^[//#\s]+/, '');
      } else {
        artifact.title = `${artifact.language} Code`;
      }
    }
  }
}