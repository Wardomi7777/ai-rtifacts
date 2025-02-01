import { useState } from 'react';
import { LLMAPIClient } from '../services/llm/api/client';
import { WEBSITE_SYSTEM_PROMPT } from '../services/llm/prompts/website';
import { DocumentArtifact } from '../types/artifacts';

export const useWebsiteGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWebsite = async (document: DocumentArtifact) => {
    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          { role: 'system', content: WEBSITE_SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: JSON.stringify({
              document: {
                content: document.content,
                title: document.title,
                metadata: document.metadata
              }
            })
          }
        ]
      });

      const result = JSON.parse(response);
      
      if (!result.type || result.type !== 'website') {
        throw new Error('Invalid website generation response');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate website';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateWebsite,
    loading,
    error
  };
};