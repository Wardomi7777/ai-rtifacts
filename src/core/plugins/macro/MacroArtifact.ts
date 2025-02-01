import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { MacroArtifact as IMacroArtifact, MacroStep } from '../../../types/artifacts';

export class MacroArtifact extends BaseArtifact implements IMacroArtifact {
  type = 'macro' as const;
  steps: MacroStep[] = [];
  currentStep = 0;
  status: 'pending' | 'running' | 'completed' | 'error' = 'pending';
  error?: string;
  knowledge: string[] = [];

  validate(): void {
    if (!Array.isArray(this.steps) || this.steps.length === 0) {
      throw new Error('Macro must have at least one step');
    }

    // Validate each step
    this.steps.forEach((step, index) => {
      if (!step.type) {
        throw new Error(`Step ${index} must have a type`);
      }

      if (!step.prompt || typeof step.prompt !== 'string') {
        throw new Error(`Step ${index} must have a prompt`);
      }

      if (step.addToKnowledge !== undefined && typeof step.addToKnowledge !== 'boolean') {
        throw new Error(`Invalid addToKnowledge value for step ${index}`);
      }
    });

    if (!['pending', 'running', 'completed', 'error'].includes(this.status)) {
      throw new Error('Invalid macro status');
    }

    if (this.currentStep < 0 || this.currentStep >= this.steps.length) {
      throw new Error('Invalid currentStep value');
    }

    if (this.error && typeof this.error !== 'string') {
      throw new Error('Error message must be a string');
    }

    if (!Array.isArray(this.knowledge)) {
      throw new Error('Knowledge must be an array');
    }
  }

  getContent(): string {
    return this.steps.map((step, index) => 
      `${index + 1}. ${step.type}: ${step.prompt}`
    ).join('\n');
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}