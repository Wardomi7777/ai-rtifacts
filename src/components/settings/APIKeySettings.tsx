import React, { useState } from 'react';
import { Key, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';

interface APIKey {
  name: string;
  key: string;
  description: string;
  required: boolean;
  onSave?: () => void;
}

const API_KEYS: APIKey[] = [
  {
    name: 'OPENAI_API_KEY',
    key: 'openai',
    description: 'Required for generating content, images, and voice transcription',
    required: true
  },
  {
    name: 'ELEVENLABS_API_KEY',
    key: 'elevenlabs',
    description: 'Required for text-to-speech functionality',
    required: false
  },
  {
    name: 'PERPLEXITY_API_KEY',
    key: 'perplexity',
    description: 'Required for search functionality',
    required: false
  }
];

export const APIKeySettings: React.FC<APIKeySettings> = ({ onSave }) => {
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('api_keys');
    return saved ? JSON.parse(saved) : {};
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    try {
      // Validate required keys
      const missingRequired = API_KEYS
        .filter(k => k.required && !keys[k.key]?.trim())
        .map(k => k.name);

      if (missingRequired.length > 0) {
        setError(`Missing required API keys: ${missingRequired.join(', ')}`);
        return;
      }

      localStorage.setItem('api_keys', JSON.stringify(keys));
      setSaved(true);
      setError(null);
      
      // Show success message briefly
      setTimeout(() => setSaved(false), 2000);
      
      // Call onSave callback if provided, otherwise reload
      if (onSave) {
        onSave();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError('Failed to save API keys');
    }
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
      </div>

      <div className="space-y-6">
        {API_KEYS.map(({ name, key, description, required }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {name}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={showKeys[key] ? 'text' : 'password'}
                value={keys[key] || ''}
                onChange={(e) => setKeys(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                placeholder={`Enter your ${name}`}
              />
              <button
                type="button"
                onClick={() => toggleShowKey(key)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showKeys[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        ))}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save API Keys'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Your API keys are stored securely in your browser's local storage and are never sent to our servers.
        </p>
      </div>
    </div>
  );
};