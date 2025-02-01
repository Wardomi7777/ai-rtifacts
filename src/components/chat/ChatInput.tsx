import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronDown, ChevronUp, FileUp, AlertCircle } from 'lucide-react';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { ArtifactTypeSelector } from './ArtifactTypeSelector';
import { TemplateSelector } from './TemplateSelector';
import { ImageUpload } from './ImageUpload';
import { typeConfig } from '../../config/artifactTypes';
import { FileImport } from './FileImport';
import { VoiceInput } from '../ui/VoiceInput';

export const ChatInput: React.FC = () => {
  const { question, artifactType, setQuestion, setArtifactType, loading, generateArtifact } = useArtifactStore();
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [shouldShowAbove, setShouldShowAbove] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { selectedTemplate } = useTemplateStore();

  useEffect(() => {
    const checkPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setShouldShowAbove(spaceBelow < 200); // 200px threshold for dropdown height
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    // Add user message with template reference
    const userMessage = {
      content: question,
      isUser: true,
      templateId: selectedTemplate?.id,
      references: []
    };

    // Generate artifact with template context
    const prompt = selectedTemplate
      ? `${question}\n\nTemplate Structure:\n${selectedTemplate.content}`
      : question;

    await generateArtifact(prompt, artifactType, userMessage);
    setQuestion('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pb-6 pt-12 z-10">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 z-20">
          {/* Artifact Type Selector */}
          <div className="absolute top-0 right-0 transform -translate-y-full flex gap-2 mb-2 z-20">
            <TemplateSelector
              artifactType={artifactType}
              isOpen={isTemplateSelectorOpen}
              onToggle={() => setIsTemplateSelectorOpen(!isTemplateSelectorOpen)}
              shouldShowAbove={shouldShowAbove}
            />
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsTypeSelectorOpen(!isTypeSelectorOpen)}
            className={`px-4 py-2 text-sm flex items-center gap-2 bg-white rounded-t-lg border border-gray-200 border-b-0 ${typeConfig[artifactType].color}`}
          >
            {React.createElement(typeConfig[artifactType].icon, { size: 16 })}
            {artifactType}
            {isTypeSelectorOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          </div>
          
          {isTypeSelectorOpen && (
            <div className={`absolute ${shouldShowAbove ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-48 z-30`}>
              <ArtifactTypeSelector
                selected={artifactType}
                onSelect={(type) => {
                  setArtifactType(type);
                  setIsTypeSelectorOpen(false);
                }}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-end gap-2 p-4">
            <FileImport 
              onFileProcessed={(content) => setQuestion(content)} 
            />
            <ImageUpload className="flex-shrink-0" />
            <VoiceInput
              onResult={setQuestion}
              onError={setVoiceError}
              className="flex-shrink-0"
            />
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to create?"
              className="flex-1 resize-none p-2 bg-transparent focus:outline-none min-h-[60px] max-h-[200px]"
              rows={1}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="flex-shrink-0 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          {voiceError && (
            <div className="px-4 pb-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{voiceError}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};