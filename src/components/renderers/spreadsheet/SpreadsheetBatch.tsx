import React, { useState } from 'react';
import { Send, AlertCircle, Wand2 } from 'lucide-react';
import { LLMAPIClient } from '../../../services/llm/api/client';
import { VoiceInput } from '../../ui/VoiceInput';
import { ArtifactTypeSelector } from '../../chat/ArtifactTypeSelector';
import { useArtifactStore } from '../../../store/useArtifactStore';

interface SpreadsheetBatchProps {
  columns: string[];
  rows: string[][];
}

export const SpreadsheetBatch: React.FC<SpreadsheetBatchProps> = ({ columns, rows }) => {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showTransform, setShowTransform] = useState<number | 'all' | null>(null);
  const { generateArtifact } = useArtifactStore();

  const processBatch = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const llmClient = new LLMAPIClient();
      const batchResults: string[] = [];

      for (const row of rows) {
        const rowData = Object.fromEntries(
          columns.map((col, index) => [col, row[index]])
        );

        const response = await llmClient.complete({
          messages: [
            {
              role: 'system',
              content: 'Process the following data according to the user\'s instruction. Return only the result, no explanations.'
            },
            {
              role: 'user',
              content: `Instruction: ${prompt}\n\nData: ${JSON.stringify(rowData)}`
            }
          ]
        });

        batchResults.push(response);
      }

      setResults(batchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process batch');
    } finally {
      setLoading(false);
    }
  };

  const handleTransform = (type: ArtifactType, index?: number) => {
    setShowTransform(null); // Close panel immediately
    
    const content = index !== undefined
      ? results[index]
      : results.join('\n\n---\n\n');

    generateArtifact(content, type);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
        <label htmlFor="batch-prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Batch Process Rows
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border-0 bg-white shadow-inner ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-purple-600">
            <input
              id="batch-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter instruction to process each row..."
              className="flex-1 min-w-0 px-4 py-3 text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
              disabled={loading}
            />
            <VoiceInput
              onResult={setPrompt}
              onError={setVoiceError}
              className="mr-2"
            />
          </div>
          <button
            onClick={processBatch}
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-sm"
          >
            <Send size={18} />
            {loading ? 'Processing...' : 'Process'}
          </button>
        </div>
      </div>

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

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="p-4 bg-gray-50 rounded-lg text-gray-700 font-mono text-sm">
                  {result}
                  <button
                    onClick={() => setShowTransform(index)}
                    className="absolute right-2 top-2 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Wand2 size={16} className="text-gray-600" />
                  </button>
                </div>
                
                {showTransform === index && (
                  <div className="absolute right-0 top-full mt-2 z-10 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
                    <ArtifactTypeSelector
                      selected="document"
                      onSelect={(type) => handleTransform(type, index)}
                    />
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTransform('all')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Wand2 size={16} />
                Transform All Results
              </button>
            </div>
            
            {showTransform === 'all' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Transform All Results</h3>
                  <ArtifactTypeSelector
                    selected="document"
                    onSelect={(type) => handleTransform(type)}
                  />
                  <button
                    onClick={() => setShowTransform(null)}
                    className="mt-4 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};