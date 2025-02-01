import { MacroArtifact, MacroStep } from '../../../../types/artifacts';

function validateMacroStep(step: MacroStep, index: number): void {
  const validTypes = [
    'ask', 'think', 'document', 'spreadsheet', 'diagram',
    'form', 'search', 'layout', 'image', 'voice'
  ];

  if (!validTypes.includes(step.type)) {
    throw new Error(`Invalid step type "${step.type}" at index ${index}`);
  }

  if (!step.prompt || typeof step.prompt !== 'string') {
    throw new Error(`Step at index ${index} must have a prompt`);
  }

  if (step.completed !== undefined && typeof step.completed !== 'boolean') {
    throw new Error(`Invalid completed status for step at index ${index}`);
  }

  if (step.artifactId !== undefined && typeof step.artifactId !== 'string') {
    throw new Error(`Invalid artifactId for step at index ${index}`);
  }
}

export function validateMacroArtifact(data: MacroArtifact): void {
  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    throw new Error('Macro must have at least one step');
  }

  data.steps.forEach((step, index) => {
    validateMacroStep(step, index);
  });

  if (!['pending', 'running', 'completed', 'error'].includes(data.status)) {
    throw new Error('Invalid macro status');
  }

  if (data.currentStep !== undefined) {
    if (!Number.isInteger(data.currentStep) || data.currentStep < 0 || data.currentStep >= data.steps.length) {
      throw new Error('Invalid currentStep value');
    }
  }

  if (data.error !== undefined && typeof data.error !== 'string') {
    throw new Error('Error message must be a string');
  }
}