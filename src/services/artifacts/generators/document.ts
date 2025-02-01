import { DocumentArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';

export class DocumentGenerator extends BaseArtifactGenerator<DocumentArtifact> {
  readonly type = 'document' as const;

  async generate(prompt: string): Promise<DocumentArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `Generate a well-structured markdown document based on the user's request.
Your response must be a valid JSON object with this structure:
{
  "type": "document",
  "format": "markdown",
  "content": "string (markdown content)",
  "title": "string",
  "description": "string",
  "metadata": {
    "toc": boolean,
    "lastUpdated": "ISO date string",
    "author": "string",
    "tags": ["string"]
  },
  "style": {
    "theme": "default" | "academic" | "technical",
    "fontSize": "normal" | "large",
    "lineHeight": "normal" | "relaxed" | "loose"
  }
}`
        },
        { role: 'user', content: prompt }
      ]
    });

    const parsed = JSON.parse(response);
    return {
      ...parsed,
      id: this.generateId(),
      type: this.type
    };
  }
}