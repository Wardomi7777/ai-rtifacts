import { useState } from 'react';
import { DocumentArtifact } from '../types/artifacts';
import { LLMAPIClient } from '../services/llm/api/client';

const DOCUMENT_EDIT_PROMPT = `You are a document editing assistant. Given a document in markdown format and an editing request, modify the document according to the request while maintaining its markdown structure and formatting.

CRITICAL REQUIREMENTS:
1. Preserve the document's overall structure and formatting
2. Keep all markdown syntax intact (headers, lists, code blocks, etc.)
3. Make requested changes while maintaining document coherence
4. Return the response in valid JSON format with the modified document

Your response must follow this exact format:
{
  "type": "document",
  "format": "markdown",
  "content": "modified markdown content",
  "title": "original or modified title",
  "description": "description of changes made",
  "metadata": {
    "toc": boolean,
    "lastUpdated": "current date",
    "author": "original author",
    "tags": ["existing tags"]
  }
}`;

export const useDocumentLLM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processDocument = async (question: string, currentContent: string): Promise<DocumentArtifact | null> => {
    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          { role: 'system', content: DOCUMENT_EDIT_PROMPT },
          { 
            role: 'user', 
            content: JSON.stringify({
              request: question,
              currentDocument: currentContent
            })
          }
        ]
      });

      const result = JSON.parse(response);
      
      if (!result.type || result.type !== 'document' || !result.content) {
        throw new Error('Invalid response format from LLM');
      }

      return result as DocumentArtifact;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process document';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    processDocument,
    loading,
    error
  };
};