import React from 'react';
import { useTemplateStore } from '../../../store/useTemplateStore';
import { MacroStep } from '../../../types/artifacts';

interface MacroStepEditorProps {
  step: MacroStep;
  onUpdate: (updatedStep: MacroStep) => void;
}

export const MacroStepEditor: React.FC<MacroStepEditorProps> = ({ step, onUpdate }) => {
  const { templates } = useTemplateStore();
  const availableTemplates = templates.filter(t => t.type === step.type);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template (Optional)
        </label>
        <select
          value={step.templateId || ''}
          onChange={(e) => onUpdate({
            ...step,
            templateId: e.target.value || undefined
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">No template</option>
          {availableTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prompt
        </label>
        <textarea
          value={step.prompt}
          onChange={(e) => onUpdate({
            ...step,
            prompt: e.target.value
          })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          rows={3}
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={step.addToKnowledge}
            onChange={(e) => onUpdate({
              ...step,
              addToKnowledge: e.target.checked
            })}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">Add output to Knowledge Base</span>
        </label>
      </div>
    </div>
  );
};