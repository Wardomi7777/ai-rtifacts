import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { LLMAPIClient } from '../../../services/llm/api/client';
import { VoiceInput } from '../../ui/VoiceInput';
import { RemoteActionArtifact } from '../../../types/artifacts';

interface RemoteAIEditProps {
  data: RemoteActionArtifact;
  onUpdate: (newData: RemoteActionArtifact) => void;
}

export const RemoteAIEdit: React.FC<RemoteAIEditProps> = ({ data, onUpdate }) => {
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
            content: `You are a remote API configuration editor. Given an existing API configuration and an instruction, modify the configuration according to the instruction.

Your response must be a valid JSON object with this structure:
{
  "type": "remote",
  "method": "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  "url": "string",
  "title": "string",
  "description": "string",
  "headers": { "string": "string" },
  "queryParams": { "string": "string" },
  "body": "string",
  "auth": {
    "type": "bearer" | "basic" | "apiKey",
    "token": "string",
    "username": "string",
    "password": "string",
    "key": "string",
    "value": "string",
    "in": "header" | "query"
  }
}`
          },
          {
            role: 'user',
            content: `Current configuration:
${JSON.stringify(data, null, 2)}

Instruction: ${prompt}`
          }
        ]
      });

      const result = JSON.parse(response);
      
      // Validate the response
      if (!result.method || !result.url) {
        throw new Error('Invalid response format');
      }

      // Update with new data
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
        AI Edit Configuration
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border-0 bg-white shadow-inner ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-cyan-600">
          <input
            id="ai-edit-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter instruction to modify the configuration..."
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
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-sm"
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