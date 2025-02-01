import { CodeArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { CODE_SYSTEM_PROMPT } from '../../llm/prompts/code';

export class CodeGenerator extends BaseArtifactGenerator<CodeArtifact> {
  readonly type = 'code' as const;

  async generate(prompt: string): Promise<CodeArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        { role: 'system', content: CODE_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    });

    const result = JSON.parse(response);
    
    // Validate required fields
    if (!result.language || !result.source) {
      throw new Error('Invalid code artifact format');
    }

    // Validate language
    if (!['javascript', 'python', 'typescript'].includes(result.language)) {
      throw new Error('Unsupported programming language');
    }

    return {
      ...result,
      id: this.generateId(),
      type: this.type
    };
  }
}