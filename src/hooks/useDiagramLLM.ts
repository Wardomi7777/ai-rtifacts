import { useState } from 'react';
import { DiagramArtifact } from '../types/artifacts';
import { LLMAPIClient } from '../services/llm/api/client';
import { validateMermaidSyntax } from '../services/llm/utils/validators/mermaid-validator';

const DIAGRAM_EDIT_PROMPT = `You are a diagram editing assistant. Given a Mermaid diagram and an editing request, modify the diagram according to the request while maintaining valid Mermaid syntax.

CRITICAL REQUIREMENTS:
1. Preserve the diagram's overall structure where appropriate
2. Keep the diagram type (e.g., flowchart, sequence diagram)
3. Maintain valid Mermaid syntax
4. Return the response in valid JSON format

Your response must follow this exact format:
{
  "type": "diagram",
  "notation": "mermaid",
  "source": "modified mermaid source",
  "title": "original or modified title",
  "description": "description of changes made"
}

MERMAID SYNTAX RULES:
1. Always start with diagram type declaration
2. Use proper syntax for the chosen diagram type
3. Keep node names short but descriptive
4. Add meaningful labels to connections
5. Use proper indentation for readability
6. Escape special characters in text`;

export const useDiagramLLM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processDiagram = async (question: string, currentSource: string): Promise<DiagramArtifact | null> => {
    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          { role: 'system', content: DIAGRAM_EDIT_PROMPT },
          { 
            role: 'user', 
            content: JSON.stringify({
              request: question,
              currentDiagram: currentSource
            })
          }
        ]
      });

      const result = JSON.parse(response);
      
      if (!result.type || result.type !== 'diagram' || !result.source) {
        throw new Error('Invalid response format from LLM');
      }

      // Validate the new Mermaid syntax
      await validateMermaidSyntax(result.source);

      return result as DiagramArtifact;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process diagram';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    processDiagram,
    loading,
    error
  };
};