import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { FormArtifact as IFormArtifact, FormField } from '../../../types/artifacts';

export class FormArtifact extends BaseArtifact implements IFormArtifact {
  type = 'form' as const;
  fields: FormField[] = [];
  instructions = '';
  submitLabel?: string;

  validate(): void {
    if (!Array.isArray(this.fields) || this.fields.length === 0) {
      throw new Error('Form must have at least one field');
    }

    if (!this.instructions || typeof this.instructions !== 'string') {
      throw new Error('Form must have instructions');
    }

    // Validate each field
    const fieldIds = new Set<string>();
    this.fields.forEach((field, index) => {
      this.validateField(field, index);
      
      if (fieldIds.has(field.id)) {
        throw new Error(`Duplicate field id: ${field.id}`);
      }
      fieldIds.add(field.id);
    });
  }

  private validateField(field: FormField, index: number): void {
    if (!field.id) {
      throw new Error(`Field at index ${index} must have an id`);
    }

    if (!field.label) {
      throw new Error(`Field at index ${index} must have a label`);
    }

    const validTypes = ['text', 'textarea', 'select', 'number', 'date', 'email', 'tel'];
    if (!validTypes.includes(field.type)) {
      throw new Error(`Invalid field type "${field.type}" at index ${index}`);
    }

    // Validate select field options
    if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
      throw new Error(`Select field at index ${index} must have options`);
    }

    // Validate number field constraints
    if (field.type === 'number' && field.validation) {
      const { min, max } = field.validation;
      if (min !== undefined && max !== undefined && min > max) {
        throw new Error(`Invalid min/max values for number field at index ${index}`);
      }
    }

    // Validate text length constraints
    if (['text', 'textarea'].includes(field.type) && field.validation) {
      const { minLength, maxLength } = field.validation;
      if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
        throw new Error(`Invalid minLength/maxLength values for text field at index ${index}`);
      }
    }
  }

  getContent(): string {
    return this.fields.map(field => 
      `${field.label} (${field.type}${field.required ? ', required' : ''})`
    ).join('\n');
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}