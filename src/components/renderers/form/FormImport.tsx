import React, { useState } from 'react';
import { Import, Loader, MessageCircle, Search, FileText } from 'lucide-react';
import { FormField, ArtifactData } from '../../../types/artifacts';
import { Message } from '../../../types/chat';
import { useFormImport } from '../../../hooks/useFormImport';
import { useArtifactStore } from '../../../store/useArtifactStore';
import { useChatStore } from '../../../store/useChatStore';

interface FormImportProps {
  fields: FormField[];
  onImport: (values: Record<string, string>) => void;
}

export const FormImport: React.FC<FormImportProps> = ({ fields, onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentChatId, chats } = useChatStore();
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];
  const { importToForm, loading, error } = useFormImport();

  // Get all importable content
  const importableItems = messages
    .filter(m => m.artifactData || ['ask', 'think'].includes(m.type))
    .map(m => ({
      id: m.id,
      type: m.artifactData?.type || m.type,
      title: m.artifactData ? getArtifactTitle(m.artifactData) : getMessageTitle(m),
      data: m.artifactData || { type: m.type, content: m.content }
    }));

  const getIcon = (type: string) => {
    switch (type) {
      case 'ask':
      case 'think':
        return MessageCircle;
      case 'search':
        return Search;
      default:
        return FileText;
    }
  };

  const handleImport = async (data: ArtifactData) => {
    try {
      const values = await importToForm(data, fields);
      if (values) {
        onImport(values);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
      >
        <Import size={18} />
        <span>Import</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Import from Artifact
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Select an existing artifact to import its content into the form.
              </p>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                {importableItems.map(({ id, type, title, data }) => {
                  const Icon = getIcon(type);
                  return (
                  <button
                    key={id}
                    onClick={() => handleImport(data)}
                    disabled={loading}
                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <Icon size={20} className="text-gray-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{title}</div>
                      <div className="text-sm text-gray-500">Type: {type}</div>
                    </div>
                    {loading && <Loader size={16} className="animate-spin" />}
                  </button>
                )})}

                {importableItems.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No artifacts available to import from.
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function getArtifactTitle(artifact: ArtifactData): string {
  switch (artifact.type) {
    case 'document':
      return artifact.title || 'Document';
    case 'spreadsheet':
      return artifact.title || `Spreadsheet (${artifact.columns.length} columns)`;
    case 'diagram':
      return artifact.title || 'Diagram';
    case 'search':
      return 'Search Results';
    default:
      return artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1);
  }
}

function getMessageTitle(message: Message): string {
  const preview = message.content.slice(0, 50);
  return `${message.type.charAt(0).toUpperCase() + message.type.slice(1)}: ${preview}${message.content.length > 50 ? '...' : ''}`;
}