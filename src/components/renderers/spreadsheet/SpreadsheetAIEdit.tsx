import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { LLMAPIClient } from '../../../services/llm/api/client';
import { VoiceInput } from '../../ui/VoiceInput';
import { SpreadsheetArtifact } from '../../../types/artifacts';

interface SpreadsheetAIEditProps {
  data: SpreadsheetArtifact;
  onUpdate: (newData: SpreadsheetArtifact) => void;
}

export const SpreadsheetAIEdit: React.FC<SpreadsheetAIEditProps> = ({ data, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const processEdit = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          {
            role: 'system',
            content: `You are a spreadsheet data editor. Given a spreadsheet structure and an instruction, update the data according to the instruction while maintaining the same columns.

Your response must be a valid JSON object with this structure:
{
  "columns": ["string"],
  "rows": [["string"]]
}

CRITICAL RULES:
1. Keep exactly the same columns in the same order
2. Return the same number of rows
3. Update row values according to the instruction
4. Maintain data consistency and format
5. Return only the columns and rows in the response`
          },
          {
            role: 'user',
            content: `Spreadsheet structure:
Columns: ${JSON.stringify(data.columns)}
Current rows: ${JSON.stringify(data.rows)}

Instruction: ${prompt}`
          }
        ]
      });

      const result = JSON.parse(response);
      
      // Validate the response
      if (!Array.isArray(result.columns) || !Array.isArray(result.rows)) {
        throw new Error('Invalid response format');
      }

      if (result.columns.length !== data.columns.length) {
        throw new Error('Column count mismatch');
      }

      if (result.rows.length !== data.rows.length) {
        throw new Error('Row count mismatch');
      }

      // Update the spreadsheet with new data
      onUpdate({
        ...data,
        columns: result.columns,
        rows: result.rows,
        metadata: {
          ...data.metadata,
          lastUpdated: new Date().toISOString()
        }
      });

      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process edit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
      <label htmlFor="ai-edit-prompt" className="block text-sm font-medium text-gray-700 mb-2">
        AI Edit Data
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border-0 bg-white shadow-inner ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-purple-600">
          <input
            id="ai-edit-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter instruction to modify the data..."
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
          onClick={processEdit}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-sm"
        >
          <Send size={18} />
          {loading ? 'Processing...' : 'Update'}
        </button>
      </div>

      {voiceError && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          <p>{voiceError}</p>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};