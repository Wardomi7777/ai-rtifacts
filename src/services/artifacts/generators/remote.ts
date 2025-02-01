import { RemoteActionArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { REMOTE_SYSTEM_PROMPT } from '../../llm/prompts/remote';

export class RemoteGenerator extends BaseArtifactGenerator<RemoteActionArtifact> {
  readonly type = 'remote' as const;

  async generate(prompt: string): Promise<RemoteActionArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        { role: 'system', content: REMOTE_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    });

    const result = JSON.parse(response);
    
    // Validate required fields
    if (!result.title || !result.description) {
      throw new Error('Remote action must have title and description');
    }

    return {
      ...result,
      id: this.generateId(),
      type: this.type
    };
  }
}