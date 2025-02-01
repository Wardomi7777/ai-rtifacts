import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { ArtifactType } from '../../types/artifacts';
import { artifactTypes, typeConfig } from '../../config/artifactTypes';
import { useArtifactStore } from '../../store/useArtifactStore';

interface CreateArtifactPanelProps {
  onClose: () => void;
}

export const CreateArtifactPanel: React.FC<CreateArtifactPanelProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null);
  const [prompt, setPrompt] = useState('');
  const { generateArtifact, loading } = useArtifactStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !prompt.trim() || loading) return;

    try {
      await generateArtifact(prompt, selectedType);
      onClose();
    } catch (error) {
      console.error('Failed to create artifact:', error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Type Selector */}
        <div className="flex gap-2 pb-4 overflow-x-auto">
          {artifactTypes.map(type => {
            const config = typeConfig[type];
            const isSelected = selectedType === type;
            
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? `${config.gradient} text-white`
                    : `${config.color} ${config.hover} bg-white`
                }`}
              >
                <config.icon size={20} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input */}
        {selectedType && (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`What kind of ${selectedType} would you like to create?`}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={20} />
              <span>{loading ? 'Creating...' : 'Create'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};