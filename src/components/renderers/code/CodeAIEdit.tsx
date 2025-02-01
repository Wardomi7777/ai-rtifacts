import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { LLMAPIClient } from '../../../services/llm/api/client';
import { VoiceInput } from '../../ui/VoiceInput';
import { CodeArtifact } from '../../../types/artifacts';

interface CodeAIEditProps {
  data: CodeArtifact;
  onUpdate: (newData: CodeArtifact) => void;
}

export const CodeAIEdit: React.FC<CodeAIEditProps> = ({ data, onUpdate }) => {
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
            content: `You are a code editor assistant. Given existing code and an instruction, modify the code according to the instruction while maintaining its structure and functionality.

Your response must be a valid JSON object with this structure:
{
  "type": "code",
  "language": "${data.language}",
  "source": "string (the modified code)",
  "title": "string (keep or update title)",
  "description": "string (update to reflect changes)",
  "inputs": [
    {
      "id": "string",
      "label": "string",
      "type": "text" | "number" | "boolean",
      "defaultValue": any
    }
  ]
}

CRITICAL RULES:
1. Keep the same language
2. Maintain code quality and readability
3. Update inputs if needed
4. Keep error handling
5. Return valid JSON only`
          },
          {
            role: 'user',
            content: `Current code:
${data.source}

Current inputs:
${JSON.stringify(data.inputs, null, 2)}

Instruction: ${prompt}`
          }
        ]
      });

      const result = JSON.parse(response);
      
      // Validate the response
      if (!result.source || result.language !== data.language) {
        throw new Error('Invalid response format');
      }

      // Update the code with new data
      onUpdate({
        ...data,
        ...result
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
        AI Edit Code
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border-0 bg-white shadow-inner ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-emerald-600">
          <input
            id="ai-edit-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter instruction to modify the code..."
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
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-sm"
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