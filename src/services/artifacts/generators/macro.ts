import { MacroArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { getMacroSystemPrompt } from '../../llm/prompts/macro';
import { useTemplateStore } from '../../../store/useTemplateStore';

export class MacroGenerator extends BaseArtifactGenerator<MacroArtifact> {
  readonly type = 'macro' as const;

  async generate(prompt: string): Promise<MacroArtifact> {
    const { templates } = useTemplateStore.getState();
    
    const response = await this.llmClient.complete({
      messages: [
        { role: 'system', content: getMacroSystemPrompt(templates) },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4o'
    });

    const result = JSON.parse(response);
    
    // Ensure required fields are present
    if (!result.title || !result.description || !Array.isArray(result.steps)) {
      throw new Error('Invalid macro response format');
    }

    return {
      ...result,
      id: this.generateId(),
      type: 'macro',
      knowledge: result.knowledge || [],
      steps: result.steps.map(step => ({
        ...step,
        addToKnowledge: step.addToKnowledge ?? false
      })),
      status: 'pending',
      currentStep: 0
    };
  }
}