import { CodeArtifact } from '../../../../types/artifacts';

export function validateCodeArtifact(data: CodeArtifact): void {
  // Validate required fields
  if (!data.language) {
    throw new Error('Code artifact must have a language');
  }

  if (!['javascript', 'python', 'typescript'].includes(data.language)) {
    throw new Error('Invalid language. Must be javascript, python, or typescript');
  }

  if (!data.source || typeof data.source !== 'string') {
    throw new Error('Code artifact must have source code');
  }

  // Validate inputs if present
  if (data.inputs) {
    if (!Array.isArray(data.inputs)) {
      throw new Error('Inputs must be an array');
    }

    const inputIds = new Set<string>();
    
    data.inputs.forEach((input, index) => {
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
  }
}