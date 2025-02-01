import { FormArtifact, FormField } from '../../../../types/artifacts';

export function validateFormArtifact(data: FormArtifact): void {
  // Validate required fields
  if (!Array.isArray(data.fields) || data.fields.length === 0) {
    throw new Error('Form must have at least one field');
  }

  if (typeof data.instructions !== 'string' || !data.instructions.trim()) {
    throw new Error('Form must have instructions');
  }

  // Validate each field
  const fieldIds = new Set<string>();
  
  data.fields.forEach((field, index) => {
    validateFormField(field, index);
    
    if (fieldIds.has(field.id)) {
      throw new Error(`Duplicate field id: ${field.id}`);
    }
    fieldIds.add(field.id);
  });
}

function validateFormField(field: FormField, index: number): void {
  // Validate required field properties
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
  if (field.type === 'select') {
    if (!Array.isArray(field.options) || field.options.length === 0) {
      throw new Error(`Select field at index ${index} must have options`);
    }
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