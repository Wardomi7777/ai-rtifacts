import { DiagramArtifact } from '../../../types/artifacts';
import { BaseArtifactGenerator } from './base';
import { validateMermaidSyntax } from '../../llm/utils/validators/mermaid-validator';

export class DiagramGenerator extends BaseArtifactGenerator<DiagramArtifact> {
  readonly type = 'diagram' as const;

  async generate(prompt: string): Promise<DiagramArtifact> {
    const response = await this.llmClient.complete({
      messages: [
        {
          role: 'system',
          content: `Generate a Mermaid diagram based on the user's request.
Your response must be a valid JSON object with this structure:
{
  "type": "diagram",
  "notation": "mermaid",
  "source": "string (valid mermaid syntax)",
  "title": "string",
  "description": "string"
}

MERMAID SYNTAX RULES:
1. Always start with diagram type (graph TD, sequenceDiagram, etc.)
2. Use proper syntax for the chosen diagram type
3. Keep node names short but descriptive
4. Add meaningful labels to connections
5. Use proper indentation for readability
6. Escape special characters in text`
        },
        { role: 'user', content: prompt }
      ]
    });

    const parsed = JSON.parse(response);
    
    // Validate Mermaid syntax before returning
    await validateMermaidSyntax(parsed.source);
    
    return {
      ...parsed,
      id: this.generateId(),
      type: this.type
    };
  }
}