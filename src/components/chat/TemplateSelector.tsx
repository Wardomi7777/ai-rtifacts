import React from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useTemplateStore } from '../../store/useTemplateStore';
import { Template } from '../../types/templates';

interface TemplateSelectorProps {
  artifactType: string;
  isOpen: boolean;
  shouldShowAbove: boolean;
  onToggle: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  artifactType,
  isOpen,
  shouldShowAbove,
  onToggle,
}) => {
  const { templates, selectedTemplate, setSelectedTemplate } = useTemplateStore();
  const availableTemplates = templates.filter((t) => t.type === artifactType);

  if (availableTemplates.length === 0) return null;

  return (
    <div className="relative flex">
      <button
        type="button"
        onClick={onToggle}
        className="px-4 py-2 text-sm flex items-center gap-2 bg-white rounded-t-lg border border-gray-200 border-b-0 text-gray-600 hover:text-gray-900"
      >
        <FileText size={16} />
        <span>{selectedTemplate?.name || 'Select Template'}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={`absolute ${
          shouldShowAbove ? 'bottom-full mb-12' : 'top-full mt-1'
        } left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50`}>
          <button
            onClick={() => {
              setSelectedTemplate(null);
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
          >
            No Template
          </button>
          
          {availableTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              <div className="font-medium text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {template.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};