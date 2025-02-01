import React from 'react';
import { Database } from 'lucide-react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { useArtifactStore } from '../../store/useArtifactStore';
import { extractArtifactContent } from '../../services/artifacts/utils/contentExtractor';

interface KnowledgeBaseSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  shouldShowAbove: boolean;
  selectedKnowledgeBaseId?: string;
  onSelect: (id: string | null) => void;
}

export const KnowledgeBaseSelector: React.FC<KnowledgeBaseSelectorProps> = ({
  isOpen,
  onToggle,
  shouldShowAbove,
  selectedKnowledgeBaseId,
  onSelect
}) => {
  const { knowledgeBases } = useKnowledgeStore();
  const { artifacts } = useArtifactStore();

  if (knowledgeBases.length === 0) {
    return null;
  }

  const getKnowledgeBaseContent = (knowledgeBaseId: string): string => {
    const kb = knowledgeBases.find(kb => kb.id === knowledgeBaseId);
    if (!kb) return '';

    return kb.artifactIds
      .map(artifactId => {
        const artifact = artifacts.find(a => a.id === artifactId);
        if (!artifact) return '';
        return extractArtifactContent(artifact);
      })
      .filter(Boolean)
      .join('\n\n---\n\n');
  };

  return (
    <div className="relative flex">
      <button
        type="button"
        onClick={onToggle}
        className={`px-4 py-2 text-sm flex items-center gap-2 bg-white rounded-lg border ${
          selectedKnowledgeBaseId ? 'text-purple-600 border-purple-200' : 'text-gray-700 border-gray-200'
        }`}
      >
        <Database size={16} />
        <span>{selectedKnowledgeBaseId 
          ? knowledgeBases.find(kb => kb.id === selectedKnowledgeBaseId)?.name || 'Knowledge Base'
          : 'Select Knowledge'
        }</span>
      </button>

      {isOpen && (
        <div className={`absolute ${
          shouldShowAbove ? 'bottom-full mb-2' : 'top-full mt-2'
        } left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50`}>
          <button
            onClick={() => {
              onSelect(null);
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            No Knowledge Base
          </button>
          
          {knowledgeBases.map((kb) => (
            <button
              key={kb.id}
              onClick={() => {
                onSelect(kb.id);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full bg-${kb.color}-500`} />
              <span>{kb.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};