import { LayoutArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { LAYOUT_SYSTEM_PROMPT } from '../../llm/prompts/layout';

export class LayoutGenerator extends BaseArtifactGenerator<LayoutArtifact> {
  readonly type = 'layout' as const;

  async generate(prompt: string): Promise<LayoutArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `${LAYOUT_SYSTEM_PROMPT}

Your response must include title and description fields:
{
  "type": "layout",
  "title": "string (short, descriptive title)",
  "description": "string (brief overview of the layout)",
  "code": { ... },
  "metadata": { ... }
}`
        },
        { role: 'user', content: prompt }
      ]
    });

    const parsed = JSON.parse(response);
    
    if (!parsed.title || !parsed.description) {
      throw new Error('Layout response must include title and description');
    }
    
    return {
      ...parsed,
      id: this.generateId(),
      type: this.type
    };
  }
}