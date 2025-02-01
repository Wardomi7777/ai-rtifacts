import React from 'react';
import { Database } from 'lucide-react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';

interface KnowledgeBaseMenuProps {
  artifactId: string;
  onClose: () => void;
}

export const KnowledgeBaseMenu: React.FC<KnowledgeBaseMenuProps> = ({
  artifactId,
  onClose
}) => {
  const { knowledgeBases, addArtifactToKnowledgeBase } = useKnowledgeStore();

  const handleAddToKnowledgeBase = (knowledgeBaseId: string) => {
    addArtifactToKnowledgeBase(knowledgeBaseId, artifactId);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
        Add to Knowledge Base
      </div>
      {knowledgeBases.length === 0 ? (
        <div className="px-4 py-2 text-sm text-gray-500">
          No knowledge bases available
        </div>
      ) : (
        knowledgeBases.map((kb) => (
          <button
            key={kb.id}
            onClick={() => handleAddToKnowledgeBase(kb.id)}
            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
          >
            <div className={`w-3 h-3 rounded-full bg-${kb.color}-500`} />
            <span>{kb.name}</span>
          </button>
        ))
      )}
    </div>
  );
};