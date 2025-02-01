import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { ArtifactType } from '../../types/artifacts';
import { artifactTypes, typeConfig } from '../../config/artifactTypes';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { useQuoteStore } from '../../store/useQuoteStore';
import { useChatStore } from '../../store/useChatStore';
import { extractArtifactContent } from '../../services/artifacts/utils/contentExtractor';
import { VoiceInput } from '../ui/VoiceInput';
import { TemplateSelector } from '../chat/TemplateSelector';
import { KnowledgeBaseSelector } from '../chat/KnowledgeBaseSelector';

export const ArtifactTypeBar: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isKnowledgeSelectorOpen, setIsKnowledgeSelectorOpen] = useState(false);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { artifacts, generateArtifact, loading } = useArtifactStore();
  const { selectedTemplate } = useTemplateStore();
  const { knowledgeBases } = useKnowledgeStore();
  const { quotedArtifacts, quotedContents, clearQuotedArtifacts } = useQuoteStore();
  const { currentChatId, setChatOpen } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !prompt.trim() || loading) return;

    try {
      // Add quoted artifacts as references
      const references = Array.from(quotedArtifacts).map(artifactId => ({
        type: 'quote' as const,
        artifactId,
        content: quotedContents.get(artifactId)
      }));

      const userMessage = {
        content: prompt,
        isUser: true,
        templateId: selectedTemplate?.id,
        knowledgeBaseId: selectedKnowledgeBaseId,
        references
      };

      // Generate artifact with template context
      const promptWithTemplate = selectedTemplate
        ? `${prompt}\n\nTemplate Structure:\n${selectedTemplate.content}`
        : `${prompt}\n\n${
          references.length > 0 
            ? `Referenced content:\n${references
                .map(ref => ref.content)
                .filter(Boolean)
                .join('\n\n---\n\n')}\n\n`
            : ''
        }`;

      // Add knowledge base content if selected
      const promptWithKnowledge = selectedKnowledgeBaseId
        ? `${promptWithTemplate}\n\nKnowledge Base:\n${getKnowledgeBaseContent(selectedKnowledgeBaseId)}`
        : promptWithTemplate;

      await generateArtifact(promptWithKnowledge, selectedType, userMessage);
      setPrompt('');
      setSelectedType(null);

      // For Ask/Think artifacts, automatically expand chat drawer
      if (selectedType === 'ask' || selectedType === 'think') {
        setChatOpen(true);
      }
      
      setIsTemplateSelectorOpen(false);
      setIsKnowledgeSelectorOpen(false);
      setSelectedKnowledgeBaseId(null);
      clearQuotedArtifacts(); // Clear quotes after successful generation
    } catch (error) {
      console.error('Failed to create artifact:', error);
    }
  };

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
    <div>
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex gap-1 sm:gap-2 overflow-x-auto max-w-full">
          {artifactTypes.map(type => {
            const config = typeConfig[type];
            const isSelected = selectedType === type;
        
            return (
              <button
                key={type}
                onClick={() => setSelectedType(isSelected ? null : type)}
                className={`p-2 sm:p-3 rounded-xl transition-all flex-shrink-0 ${
                  isSelected
                    ? `${config.gradient} text-white shadow-md scale-110`
                    : `${config.color} ${config.hover} hover:scale-105`
                }`}
                title={config.label}
              >
                <config.icon size={16} className="sm:w-5 sm:h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Input */}
      {selectedType && (
        <div className="mb-4 sm:mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4">
          {/* Template Selector */}
          <div className="mb-4 flex justify-end gap-2">
            <KnowledgeBaseSelector
              isOpen={isKnowledgeSelectorOpen}
              onToggle={() => setIsKnowledgeSelectorOpen(!isKnowledgeSelectorOpen)}
              shouldShowAbove={false}
              selectedKnowledgeBaseId={selectedKnowledgeBaseId}
              onSelect={setSelectedKnowledgeBaseId}
            />
            <TemplateSelector
              artifactType={selectedType}
              isOpen={isTemplateSelectorOpen}
              onToggle={() => setIsTemplateSelectorOpen(!isTemplateSelectorOpen)}
              shouldShowAbove={false}
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Create ${selectedType}...`}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
                autoFocus
              />
            </div>
            
            <div className="flex gap-2">
              <VoiceInput
                onResult={setPrompt}
                onError={setVoiceError}
                className="flex-shrink-0"
              />
              
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 sm:flex-initial flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
                <span>{loading ? 'Creating...' : 'Create'}</span>
              </button>
            </div>
          </form>
          
          {voiceError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <span>•</span> {voiceError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};