import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useSpreadsheetAnalysis } from './useSpreadsheetAnalysis';
import { SpreadsheetArtifact } from '../../../types/artifacts';
import { AnalysisVisualization } from './AnalysisVisualization';
import { VoiceInput } from '../../ui/VoiceInput';

interface SpreadsheetAnalysisProps {
  data: SpreadsheetArtifact;
}

export const SpreadsheetAnalysis: React.FC<SpreadsheetAnalysisProps> = ({ data }) => {
  const [question, setQuestion] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { analysis, loading, error, analyzeData } = useSpreadsheetAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await analyzeData(question, data);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Analysis Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
          <label htmlFor="analysis-question" className="block text-sm font-medium text-gray-700 mb-2">
            Ask a question about this data
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border-0 bg-white shadow-inner ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-purple-600">
              <input
              id="analysis-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the average value in column 2?"
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
              {loading ? 'Analyzing...' : 'Analyze'}
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

      {/* Analysis Results */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {analysis.sql && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">SQL Query</h4>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {analysis.sql}
              </pre>
            </div>
          )}
          
          {analysis.visualization && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Visualization</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <AnalysisVisualization visualization={analysis.visualization} />
              </div>
            </div>
          )}
          
          {analysis.explanation && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Explanation</h4>
              <p className="text-gray-700">{analysis.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};