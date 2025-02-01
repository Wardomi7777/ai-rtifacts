import { FormArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';

export class FormGenerator extends BaseArtifactGenerator<FormArtifact> {
  readonly type = 'form' as const;

  async generate(prompt: string): Promise<FormArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `Generate an interactive form based on the user's request.
Your response must be a valid JSON object with this structure:
{
  "type": "form",
  "title": "string",
  "description": "string",
  "instructions": "string (You explain here clear instruction for system what to do with given informations because form will be used as automated tool)",
  "submitLabel": "string (optional, default: Submit)",
  "fields": [
    {
      "id": "string (unique identifier)",
      "type": "text" | "textarea" | "select" | "number" | "date" | "email" | "tel",
      "label": "string",
      "placeholder": "string (optional)",
      "required": boolean (optional),
      "options": ["string"] (required for select type),
      "validation": {
        "pattern": "string (regex pattern, optional)",
        "min": number (optional),
        "max": number (optional),
        "minLength": number (optional),
        "maxLength": number (optional)
      }
    }
  ],
  "metadata": {
    "lastUpdated": "ISO date string",
    "author": "string",
    "tags": ["string"]
  }
}

FIELD TYPE GUIDELINES:
- text: For short text input
- textarea: For longer text input
- select: For choosing from predefined options
- number: For numeric input
- date: For date selection
- email: For email addresses
- tel: For phone numbers

VALIDATION GUIDELINES:
- Use appropriate validation for each field type
- Add helpful placeholder text
- Make fields required when necessary
- Use clear and descriptive labels
- Provide meaningful error messages`
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