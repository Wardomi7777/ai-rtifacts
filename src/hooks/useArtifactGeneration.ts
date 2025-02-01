import { useState } from 'react';
import { useArtifactStore } from '../store/useArtifactStore';
import { ArtifactService } from '../services/artifacts/ArtifactService';
import { ArtifactData } from '../types/artifacts';
import { LLMAPIError } from '../services/llm/api/errors';

const artifactService = new ArtifactService();

export const useArtifactGeneration = () => {
  const { setLoading, setArtifactData } = useArtifactStore();
  const [error, setError] = useState<string | null>(null);

  const generateArtifact = async (question: string, artifactType: ArtifactData['type']) => {
    setError(null);
    setLoading(true);

    try {
      const artifactData = await artifactService.generateArtifact(question, artifactType);
      setArtifactData(artifactData);
    } catch (err) {
      let errorMessage = 'Failed to generate artifact';
      
      if (err instanceof LLMAPIError) {
        errorMessage = `API Error: ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('Artifact generation error:', err);
      setError(errorMessage);
      setArtifactData(null);
    } finally {
      setLoading(false);
    }
  };

  return { generateArtifact, error };
};