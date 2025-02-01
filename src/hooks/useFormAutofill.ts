import { useState } from 'react';
import { FormField } from '../types/artifacts';
import { LLMAPIClient } from '../services/llm/api/client';

export const useFormAutofill = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autofillForm = async (
    prompt: string,
    fields: FormField[]
  ): Promise<Record<string, string> | null> => {
    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          {
            role: 'system',
            content: `You are a form autofill assistant. Given a description and form fields, generate appropriate values for each field.

Your response must be a valid JSON object where:
- Keys are field IDs
- Values are appropriate for each field type and validation rules

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
              prompt,
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
      const message = err instanceof Error ? err.message : 'Failed to autofill form';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    autofillForm,
    loading,
    error
  };
};