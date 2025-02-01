import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Message } from '../../types/chat';
import { useArtifactStore } from '../../store/useArtifactStore';
import { ArtifactTypeSelector } from './ArtifactTypeSelector';

interface TransformButtonProps {
  message: Message;
}

export const TransformButton: React.FC<TransformButtonProps> = ({ message }) => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const { generateArtifact } = useArtifactStore();

  const handleTransform = async (type: ArtifactType) => {
    setShowTypeSelector(false);
    
    if (!message.artifactData) return message.content;

    const content = message.content;
    const references = [{
      type: 'context' as const,
      title: message.artifactData.title || message.artifactData.type,
      artifactType: message.artifactData.type
    }];

    await generateArtifact(content, type, references);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowTypeSelector(!showTypeSelector)}
        className={`p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ${
          !message.artifactData ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!message.artifactData}
        title="Transform this message"
      >
        <Wand2 size={16} />
      </button>

      {showTypeSelector && (
        <div className="absolute right-0 top-full mt-2 z-30 w-48 shadow-xl">
          <ArtifactTypeSelector
            selected={message.artifactData?.type || 'document'}
            onSelect={handleTransform}
          />
        </div>
      )}
    </div>
  );
};