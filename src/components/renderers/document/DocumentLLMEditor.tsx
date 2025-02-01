import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useDocumentLLM } from '../../../hooks/useDocumentLLM';
import { VoiceInput } from '../../ui/VoiceInput';

interface DocumentLLMEditorProps {
  content: string;
  onUpdate: (newContent: string) => void;
}

export const DocumentLLMEditor: React.FC<DocumentLLMEditorProps> = ({ content, onUpdate }) => {
  const [question, setQuestion] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { processDocument, loading, error } = useDocumentLLM();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      const result = await processDocument(question, content);
      if (result) {
        onUpdate(result.content);
      }
    } catch (err) {
      console.error('Failed to process document:', err);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
          <label htmlFor="llm-question" className="block text-sm font-medium text-gray-700 mb-2">
            How would you like to modify this document?
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border-0 bg-white shadow-inner ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-purple-600">
              <input
              id="llm-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Add a section about methodology, Make the introduction more concise..."
              className="flex-1 min-w-0 px-4 py-3 text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
              disabled={loading}
              />
              <VoiceInput
                onResult={setQuestion}
                onError={setVoiceError}
                className="mr-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-sm"
            >
              <Send size={18} />
              {loading ? 'Processing...' : 'Update'}
            </button>
          </div>
        </div>
      </form>
      
      {voiceError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{voiceError}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};