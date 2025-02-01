import { useState } from 'react';
import { FormField, ArtifactData } from '../types/artifacts';
import { LLMAPIClient } from '../services/llm/api/client';
import { extractArtifactContent } from '../services/artifacts/utils/contentExtractor';

export const useFormImport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importToForm = async (
    artifact: ArtifactData,
    fields: FormField[]
  ): Promise<Record<string, string> | null> => {
    setLoading(true);
    setError(null);

    try {
      const content = extractArtifactContent(artifact);
      if (!content) {
        throw new Error('Could not extract content from artifact');
      }

      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a form import assistant. Given content and form fields, extract or generate appropriate values for each field.

Your response must be a valid JSON object where:
- Keys are field IDs
- Values are appropriate for each field type and validation rules
- Values should be extracted from the content where possible
- Generate appropriate values when exact matches aren't found
- For search artifacts, consider both content and sources
- For ask/think messages, extract relevant information from the conversation

Example:
{
  "name": "John Smith",
  "email": "john@example.com",
  "age": "30"
}`
          },
          {
            role: 'user',
            content: JSON.stringify({
              artifactContent: content,
              artifactType: artifact.type,
              fields: fields.map(f => ({
                id: f.id,
                type: f.type,
                label: f.label,
                validation: f.validation,
                required: f.required,
                options: f.options
              }))
            })
          }
        ]
      });

      const result = JSON.parse(response);
      
      // Validate the response
      fields.forEach(field => {
        if (field.required && !result[field.id]) {
          throw new Error(`Missing required field: ${field.label}`);
        }
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import data';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    importToForm,
    loading,
    error
  };
};