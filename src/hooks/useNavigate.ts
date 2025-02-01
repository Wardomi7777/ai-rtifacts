import { useCallback } from 'react';
import { useArtifactStore } from '../store/useArtifactStore';
import { ArtifactData } from '../types/artifacts';

export const useNavigate = () => {
  const { setCurrentArtifact, setShowingArtifact } = useArtifactStore();

  const navigateToArtifact = useCallback((artifact: ArtifactData) => {
    setCurrentArtifact(artifact);
    setShowingArtifact(true);
  }, []);

  const navigateToChat = useCallback(() => {
    setShowingArtifact(false);
  }, []);

  return { navigateToArtifact, navigateToChat };
};