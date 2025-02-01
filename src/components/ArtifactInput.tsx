import React from 'react';
import { Send } from 'lucide-react';
import { useArtifactStore } from '../store/useArtifactStore';
import { useArtifactGeneration } from '../hooks/useArtifactGeneration';
import { ArtifactSelector } from './ArtifactSelector';

export const ArtifactInput: React.FC = () => {
  const { question, artifactType, setQuestion, setArtifactType, loading } = useArtifactStore();
  const { generateArtifact, error } = useArtifactGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateArtifact(question, artifactType);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Artifact</h2>
        <ArtifactSelector selected={artifactType} onSelect={setArtifactType} />
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to create?"
          className="w-full min-h-[120px] p-4 rounded-xl border-0 bg-white shadow-inner resize-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          disabled={loading}
        />
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          <Send size={20} />
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </form>
  );
};