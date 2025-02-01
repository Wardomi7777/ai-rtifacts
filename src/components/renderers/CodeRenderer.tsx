import React, { useState } from 'react';
import { Play, AlertCircle, Pencil, Eye, Wand2, Save } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodeArtifact } from '../../types/artifacts';
import { CodeAIEdit } from './code/CodeAIEdit';
import { useArtifactStore } from '../../store/useArtifactStore';
import { ArtifactTypeSelector } from '../chat/ArtifactTypeSelector';

interface CodeRendererProps {
  data: CodeArtifact;
}

export const CodeRenderer: React.FC<CodeRendererProps> = ({ data }) => {
  const { updateArtifact, generateArtifact } = useArtifactStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showAIEdit, setShowAIEdit] = useState(false);
  const [showTransform, setShowTransform] = useState(false);
  const [editedSource, setEditedSource] = useState(data.source);
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    // Initialize inputs with default values
    return data.inputs?.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.defaultValue
    }), {}) || {};
  });
  const [result, setResult] = useState(data.lastResult);
  const [isRunning, setIsRunning] = useState(false);

  const handleInputChange = (id: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Create a function from the source code
      const fn = new Function('inputs', data.source);
      
      // Run the code with inputs
      const output = await fn(inputs);
      
      const newResult = {
        output: String(output),
        timestamp: new Date().toISOString()
      };
      
      setResult(newResult);
    } catch (error) {
      setResult({
        output: '',
        error: error instanceof Error ? error.message : 'An error occurred',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
            {data.description && (
              <p className="mt-1 text-gray-600">{data.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setShowAIEdit(false);
                if (!isEditing) {
                  setEditedSource(data.source);
                } else {
                  updateArtifact({
                    ...data,
                    source: editedSource
                  });
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              {isEditing ? (
                <>
                  <Eye size={20} />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <Pencil size={20} />
                  <span>Edit</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowAIEdit(!showAIEdit);
                setIsEditing(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              <Wand2 size={20} />
              <span>AI Edit</span>
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Play size={20} />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage={data.language}
          value={isEditing ? editedSource : data.source}
          onChange={(value) => setEditedSource(value || '')}
          theme="vs-dark"
          options={{
            readOnly: !isEditing,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </div>

      {/* Inputs */}
      {data.inputs && data.inputs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {input.label}
                </label>
                {input.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={inputs[input.id] || false}
                    onChange={(e) => handleInputChange(input.id, e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                ) : (
                  <input
                    type={input.type === 'number' ? 'number' : 'text'}
                    value={inputs[input.id] || ''}
                    onChange={(e) => handleInputChange(
                      input.id,
                      input.type === 'number' ? parseFloat(e.target.value) : e.target.value
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Edit */}
      {showAIEdit && (
        <CodeAIEdit
          data={data}
          onUpdate={updateArtifact}
        />
      )}

      {/* Results */}
      {result && (
        <div className={`bg-white rounded-lg shadow-sm p-6 ${
          result.error ? 'border-red-200' : 'border-emerald-200'
        } border`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">
                {result.error ? 'Error' : 'Result'}
              </h3>
              <button
                onClick={() => setShowTransform(!showTransform)}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Wand2 size={16} className="inline-block mr-2" />
                Transform
              </button>
            </div>
            <time className="text-sm text-gray-500">
              {new Date(result.timestamp).toLocaleTimeString()}
            </time>
          </div>
          
          {showTransform && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Transform to:
              </h4>
              <ArtifactTypeSelector
                selected="document"
                onSelect={async (type) => {
                  if (result) {
                    await generateArtifact(result.output, type);
                    setShowTransform(false);
                  }
                }}
              />
            </div>
          )}

          {result.error ? (
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <pre className="text-sm overflow-auto">{result.error}</pre>
            </div>
          ) : (
            <pre className="text-sm text-gray-700 overflow-auto p-4 bg-gray-50 rounded-lg">
              {result.output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};