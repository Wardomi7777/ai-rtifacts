import { ThinkArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';

export class ThinkGenerator extends BaseArtifactGenerator<ThinkArtifact> {
  readonly type = 'think' as const;
  private readonly model = 'o1-preview-2024-09-12';

  async generate(prompt: string): Promise<ThinkArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: this.model
    });

    return {
      id: this.generateId(),
      type: this.type,
      content: response
    };
  }
}