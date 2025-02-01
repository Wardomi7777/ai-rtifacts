import { BasePlugin } from '../BasePlugin';
import { FormArtifact } from './FormArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class FormPlugin extends BasePlugin {
  metadata = {
    id: 'core.form',
    name: 'Form Plugin',
    version: '1.0.0',
    description: 'Core plugin for form artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'form';

  createArtifact(): FormArtifact {
    return new FormArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredArray(data.fields, 'fields');
        this.validateRequiredString(data.instructions, 'instructions');

        // Validate each field
        const fieldIds = new Set<string>();
        data.fields.forEach((field: any, index: number) => {
          if (!field.id) {
            throw new Error(`Field at index ${index} must have an id`);
          }

          if (fieldIds.has(field.id)) {
            throw new Error(`Duplicate field id: ${field.id}`);
          }
          fieldIds.add(field.id);

          if (!field.label) {
            throw new Error(`Field at index ${index} must have a label`);
          }

          const validTypes = ['text', 'textarea', 'select', 'number', 'date', 'email', 'tel'];
          if (!validTypes.includes(field.type)) {
            throw new Error(`Invalid field type "${field.type}" at index ${index}`);
          }

          if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
            throw new Error(`Select field at index ${index} must have options`);
          }

          if (field.validation) {
            if (field.type === 'number') {
              const { min, max } = field.validation;
              if (min !== undefined && max !== undefined && min > max) {
                throw new Error(`Invalid min/max values for number field at index ${index}`);
              }
            }

            if (['text', 'textarea'].includes(field.type)) {
              const { minLength, maxLength } = field.validation;
              if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
                throw new Error(`Invalid minLength/maxLength values for text field at index ${index}`);
              }
            }

            if (field.validation.pattern) {
              try {
                new RegExp(field.validation.pattern);
              } catch {
                throw new Error(`Invalid regex pattern for field at index ${index}`);
              }
            }
          }
        });
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: {
                type: 'string',
                enum: ['text', 'textarea', 'select', 'number', 'date', 'email', 'tel']
              },
              label: { type: 'string' },
              placeholder: { type: 'string' },
              required: { type: 'boolean' },
              options: {
                type: 'array',
                items: { type: 'string' }
              },
              validation: {
                type: 'object',
                properties: {
                  pattern: { type: 'string' },
                  min: { type: 'number' },
                  max: { type: 'number' },
                  minLength: { type: 'number' },
                  maxLength: { type: 'number' }
                }
              }
            },
            required: ['id', 'type', 'label']
          },
          minItems: 1
        },
        instructions: { type: 'string' },
        submitLabel: { type: 'string' }
      },
      required: ['fields', 'instructions']
    };
  }

  getExportFormats(): string[] {
    return ['json', 'yaml', 'html'];
  }

  async beforeCreate(data: Partial<FormArtifact>): Promise<Partial<FormArtifact>> {
    // Add default submit label if not provided
    if (!data.submitLabel) {
      data.submitLabel = 'Submit';
    }
    return data;
  }

  async afterCreate(artifact: FormArtifact): Promise<void> {
    // Generate title from first field if not provided
    if (!artifact.title && artifact.fields.length > 0) {
      artifact.title = `Form: ${artifact.fields[0].label}`;
    }
  }
}