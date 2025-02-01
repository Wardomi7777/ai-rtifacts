import { SpreadsheetArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';

export class SpreadsheetGenerator extends BaseArtifactGenerator<SpreadsheetArtifact> {
  readonly type = 'spreadsheet' as const;

  async generate(prompt: string): Promise<SpreadsheetArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `Generate a spreadsheet based on the user's request.
Your response must be a valid JSON object with this structure:
{
  "type": "spreadsheet",
  "columns": ["string"],
  "rows": [["string"]],
  "title": "string",
  "description": "string",
  "metadata": {
    "lastUpdated": "ISO date string",
    "author": "string"
  },
  "style": {
    "columnStyles": {
      "columnName": {
        "align": "left" | "center" | "right",
        "width": "string"
      }
    }
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