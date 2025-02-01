import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { ArtifactType } from '../../types/artifacts';
import { typeConfig } from '../../config/artifactTypes';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { TemplateSelector } from './TemplateSelector';
import { KnowledgeBaseSelector } from './KnowledgeBaseSelector';

interface ChatInputWithOptionsProps {
  onSubmit: (message: string, artifactType?: ArtifactType, templateId?: string) => Promise<void>;
  loading: boolean;
}

export const ChatInputWithOptions: React.FC<ChatInputWithOptionsProps> = ({
  onSubmit,
  loading
}) => {
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showKnowledgeSelector, setShowKnowledgeSelector] = useState(false);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string | null>(null);
  const { selectedTemplate, setSelectedTemplate } = useTemplateStore();
  const { knowledgeBases } = useKnowledgeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    await onSubmit(message, selectedType || undefined, selectedTemplate?.id);
    setMessage('');
    setSelectedType(null);
    setSelectedTemplate(null);
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {/* Type and Template Selectors */}
      <div className="mb-4 flex justify-end gap-2">
        <KnowledgeBaseSelector
          isOpen={showKnowledgeSelector}
          onToggle={() => setShowKnowledgeSelector(!showKnowledgeSelector)}
          shouldShowAbove={true}
          selectedKnowledgeBaseId={selectedKnowledgeBaseId}
          onSelect={setSelectedKnowledgeBaseId}
        />
        {selectedType && (
          <TemplateSelector
            artifactType={selectedType}
            isOpen={showTemplateSelector}
            onToggle={() => setShowTemplateSelector(!showTemplateSelector)}
            shouldShowAbove={true}
          />
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTypeSelector(!showTypeSelector)}
            className={`px-4 py-2 text-sm flex items-center gap-2 bg-white rounded-lg border ${
              selectedType 
                ? typeConfig[selectedType].color
                : 'text-gray-700'
            }`}
          >
            {selectedType ? (
              <>
                {React.createElement(typeConfig[selectedType].icon, { size: 16 })}
                {typeConfig[selectedType].label}
              </>
            ) : (
              'Normal Message'
            )}
            {showTypeSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showTypeSelector && (
            <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  setSelectedType(null);
                  setShowTypeSelector(false);
                  setSelectedTemplate(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                Normal Message
              </button>
              {Object.entries(typeConfig).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type as ArtifactType);
                    setShowTypeSelector(false);
                    setSelectedTemplate(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <config.icon size={16} />
                  <span>{config.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedType ? `Create ${selectedType}...` : "Type a message..."}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          <span>{loading ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};