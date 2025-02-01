import { useState } from 'react';
import { LLMAPIClient } from '../services/llm/api/client';

export const useFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (instructions: string, formData: Record<string, string>): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          {
            role: 'system',
            content: `You are a form processing assistant. Process the form data according to the provided instructions and return a clear response.

Instructions for processing: ${instructions}

Respond in a clear, user-friendly way. Focus on providing the requested output based on the form data and instructions.`
          },
          {
            role: 'user',
            content: JSON.stringify(formData)
          }
        ]
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process form';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading,
    error
  };
};