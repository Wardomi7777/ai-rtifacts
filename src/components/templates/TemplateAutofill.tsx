import React, { useState } from 'react';
import { Wand2, Loader } from 'lucide-react';
import { LLMAPIClient } from '../../services/llm/api/client';

interface TemplateAutofillProps {
  type: 'document' | 'spreadsheet' | 'diagram' | 'form';
  onGenerated: (content: string) => void;
}

export const TemplateAutofill: React.FC<TemplateAutofillProps> = ({ type, onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          {
            role: 'system',
            content: `Generate a template structure based on the user's description. The output should be in ${
              type === 'document' ? 'Markdown' : 'JSON'
            } format.

${type === 'document' ? `
For documents:
- Use markdown headings for sections
- Include placeholders for content
- Add comments for guidance
- Structure content hierarchically` : ''}

${type === 'spreadsheet' ? `
For spreadsheets:
{
  "columns": [
    {
      "name": "string",
      "type": "string | number | date | boolean",
      "description": "string"
    }
  ]
}` : ''}

${type === 'diagram' ? `
For diagrams:
{
  "nodes": [
    {
      "id": "string",
      "label": "string",
      "type": "string"
    }
  ],
  "connections": [
    {
      "from": "string (node id)",
      "to": "string (node id)",
      "label": "string"
    }
  ]
}` : ''}

${type === 'form' ? `
For forms:
{
  "fields": [
    {
      "id": "string",
      "label": "string",
      "type": "text | number | select | date",
      "required": boolean,
      "validation": {
        "pattern": "string (optional)",
        "min": "number (optional)",
        "max": "number (optional)"
      }
    }
  ]
}` : ''}`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // For documents, return as is. For others, format JSON
      const formattedContent = type === 'document' 
        ? response 
        : JSON.stringify(JSON.parse(response), null, 2);

      onGenerated(formattedContent);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your template structure..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 size={16} />
              <span>Autofill</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};