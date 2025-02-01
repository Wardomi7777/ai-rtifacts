import React from 'react';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useChatStore } from '../../store/useChatStore';
import { ArtifactCard } from './ArtifactCard';
import { Grid } from 'lucide-react';

export const ArtifactGrid: React.FC = () => {
  const { artifacts, searchQuery, selectedType } = useArtifactStore();
  const { currentChatId, chats } = useChatStore();
  
  // Get current chat's artifact IDs
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const chatArtifactIds = currentChat?.messages
    .filter(m => m.artifactData)
    .map(m => m.artifactData!.id) || [];

  // Filter artifacts based on search and type
  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = !searchQuery || 
      artifact.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || artifact.type === selectedType;
    const belongsToChat = chatArtifactIds.includes(artifact.id);
    
    return matchesSearch && matchesType && belongsToChat;
  });

  if (filteredArtifacts.length === 0) {
    return (
      <div className="text-center py-12">
        <Grid className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No artifacts</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new artifact
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredArtifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  );
};