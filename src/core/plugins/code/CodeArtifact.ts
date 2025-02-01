import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { CodeArtifact as ICodeArtifact, CodeInput } from '../../../types/artifacts';

export class CodeArtifact extends BaseArtifact implements ICodeArtifact {
  type = 'code' as const;
  language: 'javascript' | 'python' | 'typescript' = 'javascript';
  source = '';
  inputs?: CodeInput[];
  lastResult?: {
    output: string;
    error?: string;
    timestamp: string;
  };

  validate(): void {
    if (!['javascript', 'python', 'typescript'].includes(this.language)) {
      throw new Error('Invalid programming language');
    }

    if (!this.source || typeof this.source !== 'string') {
      throw new Error('Source code must be a non-empty string');
    }

    // Validate inputs if present
    if (this.inputs) {
      if (!Array.isArray(this.inputs)) {
        throw new Error('Inputs must be an array');
      }

      const inputIds = new Set<string>();
      
      this.inputs.forEach((input, index) => {
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
    if (this.lastResult) {
      if (!this.lastResult.timestamp) {
        throw new Error('Last result must have a timestamp');
      }

      if (!this.lastResult.output && !this.lastResult.error) {
        throw new Error('Last result must have either output or error');
      }
    }
  }

  getContent(): string {
    return this.source;
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}