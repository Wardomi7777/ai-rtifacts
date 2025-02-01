import React, { useState } from 'react';
import { Wand2, Loader } from 'lucide-react';
import { FormField } from '../../../types/artifacts';
import { useFormAutofill } from '../../../hooks/useFormAutofill';
import { VoiceInput } from '../../ui/VoiceInput';

interface FormAutofillProps {
  fields: FormField[];
  onAutofill: (values: Record<string, string>) => void;
}

export const FormAutofill: React.FC<FormAutofillProps> = ({ fields, onAutofill }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { autofillForm, loading, error } = useFormAutofill();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    try {
      const values = await autofillForm(prompt, fields);
      if (values) {
        onAutofill(values);
        setIsOpen(false);
        setPrompt('');
      }
    } catch (err) {
      console.error('Autofill failed:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
      >
        <Wand2 size={18} />
        <span>Autofill</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Autofill Form
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Describe the information you want to fill in the form, and I'll help you populate the fields automatically.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Fill out as a software developer with 5 years of experience..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <VoiceInput
                  onResult={setPrompt}
                  onError={setVoiceError}
                />
              </div>

              {voiceError && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <span>•</span> {voiceError}
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <span>•</span> {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Autofill'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};