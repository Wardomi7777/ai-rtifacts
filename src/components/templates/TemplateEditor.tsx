import React, { useState } from 'react';
import { useTemplateStore } from '../../store/useTemplateStore';
import { Template } from '../../types/templates';
import Editor from '@monaco-editor/react';
import { TemplateAutofill } from './TemplateAutofill';

interface TemplateEditorProps {
  template: Template | null;
  onClose: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onClose,
}) => {
  const { addTemplate, updateTemplate } = useTemplateStore();
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [type, setType] = useState(template?.type || 'document');
  const [content, setContent] = useState(template?.content || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate content based on type
      if (type !== 'document') {
        JSON.parse(content);
      }

      const newTemplate: Template = {
        id: template?.id || crypto.randomUUID(),
        name,
        description,
        type: type as Template['type'],
        content,
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (template) {
        updateTemplate(newTemplate);
      } else {
        addTemplate(newTemplate);
      }

      onClose();
    } catch (err) {
      setError('Invalid template content format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autofill Template
          </label>
          <TemplateAutofill
            type={type as Template['type']}
            onGenerated={setContent}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Template['type'])}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="document">Document</option>
            <option value="spreadsheet">Spreadsheet</option>
            <option value="diagram">Diagram</option>
            <option value="form">Form</option>
            <option value="think">Think</option>
            <option value="code">Code</option>
            <option value="remote">Remote Action</option>
            <option value="voice">Voice</option>
            <option value="search">Search</option>
            <option value="layout">Layout</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content ({type === 'document' ? 'Markdown' : 'JSON'})
          </label>
          <div className="h-[300px] border rounded-lg overflow-hidden">
            <Editor
              defaultLanguage={type === 'document' ? 'markdown' : 'json'}
              value={content}
              onChange={(value) => setContent(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {template ? 'Update' : 'Create'} Template
        </button>
      </div>
    </form>
  );
};