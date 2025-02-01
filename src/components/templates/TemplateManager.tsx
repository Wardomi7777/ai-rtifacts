import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useTemplateStore } from '../../store/useTemplateStore';
import { useUIStore } from '../../store/useUIStore';
import { Template } from '../../types/templates';
import { TemplateEditor } from './TemplateEditor';

export const TemplateManager: React.FC = () => {
  const { 
    templates,
    showTemplateManager,
    setShowTemplateManager,
    deleteTemplate 
  } = useTemplateStore();
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = [];
    }
    acc[template.type].push(template);
    return acc;
  }, {} as Record<Template['type'], Template[]>);
  
  // Update overlay state when template manager opens/closes
  React.useEffect(() => {
    useUIStore.getState().setIsAnyOverlayOpen(showTemplateManager);
  }, [showTemplateManager]);

  if (!showTemplateManager) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Template Manager</h2>
          <button
            onClick={() => setShowTemplateManager(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isCreating || editingTemplate ? (
            <TemplateEditor
              template={editingTemplate}
              onClose={() => {
                setEditingTemplate(null);
                setIsCreating(false);
              }}
            />
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setIsCreating(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600"
              >
                <Plus size={20} />
                <span>Create New Template</span>
              </button>

              <div className="space-y-6">
                {Object.entries(groupedTemplates).map(([type, templates]) => (
                  <div key={type} className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {type === 'remote' ? 'Remote Action' : type}
                    </h3>
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className="bg-gray-50 rounded-lg p-4 flex items-start justify-between group"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {template.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingTemplate(template)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteTemplate(template.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};