import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useSidebarStore } from '../../store/useSidebarStore';
import { ArtifactItem } from './ArtifactItem';
import { useNavigate } from '../../hooks/useNavigate';

export const ArtifactsSidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebarStore();
  const { chats, currentChatId } = useChatStore();
  const { navigateToArtifact } = useNavigate();

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const artifacts = messages
    .filter(m => m.artifactData && !['ask', 'think'].includes(m.artifactData.type))
    .map(m => m.artifactData!);

  if (artifacts.length === 0) return null;

  return (
    <div 
      className={`fixed right-0 top-0 h-screen transition-all duration-300 z-50 ${
        isOpen ? 'w-80' : 'w-auto'
      } ${isOpen ? 'bg-white/80 backdrop-blur-sm border-l border-gray-200 shadow-lg' : ''}`}
    >
      <button
        onClick={toggle}
        className={`p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors z-50 ${
          isOpen 
            ? 'absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'fixed right-6 top-6'
        }`}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {isOpen && (
        <div className="h-full p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Artifacts</h2>
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <ArtifactItem
                key={artifact.id}
                artifact={artifact}
                onClick={() => navigateToArtifact(artifact)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};