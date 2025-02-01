import { BasePlugin } from '../BasePlugin';
import { MacroArtifact } from './MacroArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';
import { useTemplateStore } from '../../../store/useTemplateStore';

export class MacroPlugin extends BasePlugin {
  metadata = {
    id: 'core.macro',
    name: 'Macro Plugin',
    version: '1.0.0',
    description: 'Core plugin for macro artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'macro';

  createArtifact(): MacroArtifact {
    return new MacroArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredArray(data.steps, 'steps');

        // Validate each step
        data.steps.forEach((step: any, index: number) => {
          if (!step.type) {
            throw new Error(`Step ${index} must have a type`);
          }

          if (!step.prompt || typeof step.prompt !== 'string') {
            throw new Error(`Step ${index} must have a prompt`);
          }

          if (step.addToKnowledge !== undefined && typeof step.addToKnowledge !== 'boolean') {
            throw new Error(`Invalid addToKnowledge value for step ${index}`);
          }

          if (step.templateId) {
            const templates = useTemplateStore.getState().templates;
            const template = templates.find(t => t.id === step.templateId);
            if (!template) {
              throw new Error(`Template not found for step ${index}`);
            }
            if (template.type !== step.type) {
              throw new Error(`Template type mismatch for step ${index}`);
            }
          }
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

        if (!Array.isArray(data.knowledge)) {
          throw new Error('Knowledge must be an array');
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['ask', 'think', 'document', 'spreadsheet', 'diagram', 'form', 'search', 'layout', 'image', 'voice']
              },
              prompt: {
                type: 'string',
                description: 'Step instruction'
              },
              templateId: {
                type: 'string',
                description: 'Optional template ID'
              },
              addToKnowledge: {
                type: 'boolean',
                default: false
              }
            },
            required: ['type', 'prompt']
          },
          minItems: 1
        },
        knowledge: {
          type: 'array',
          items: { type: 'string' },
          default: []
        }
      },
      required: ['steps']
    };
  }

  async beforeCreate(data: Partial<MacroArtifact>): Promise<Partial<MacroArtifact>> {
    // Set initial state
    data.status = 'pending';
    data.currentStep = 0;
    data.knowledge = data.knowledge || [];
    return data;
  }

  async afterCreate(artifact: MacroArtifact): Promise<void> {
    // Generate title from first step if not provided
    if (!artifact.title && artifact.steps.length > 0) {
      const firstStep = artifact.steps[0];
      artifact.title = `${firstStep.type} Macro: ${
        firstStep.prompt.length > 30
          ? firstStep.prompt.slice(0, 27) + '...'
          : firstStep.prompt
      }`;
    }
  }
}