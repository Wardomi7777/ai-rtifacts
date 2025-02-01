import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, Check } from 'lucide-react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useUIStore } from '../../store/useUIStore';
import { KnowledgeBaseColor } from '../../types/knowledge';
import { ArtifactItem } from '../artifacts/ArtifactItem';
import { useNavigate } from '../../hooks/useNavigate';

const COLORS: { value: KnowledgeBaseColor; label: string; bg: string; }[] = [
  { value: 'blue', label: 'Blue', bg: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-500' },
  { value: 'green', label: 'Green', bg: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-500' },
  { value: 'red', label: 'Red', bg: 'bg-red-500' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { value: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' }
];

export const KnowledgeManager: React.FC = () => {
  const { 
    knowledgeBases,
    showKnowledgeManager,
    setShowKnowledgeManager,
    addKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    addArtifactToKnowledgeBase,
    removeArtifactFromKnowledgeBase
  } = useKnowledgeStore();
  const { artifacts } = useArtifactStore();
  const { navigateToArtifact } = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState<KnowledgeBaseColor>('blue');
  const [isCreating, setIsCreating] = useState(false);

  // Update overlay state when knowledge manager opens/closes
  React.useEffect(() => {
    useUIStore.getState().setIsAnyOverlayOpen(showKnowledgeManager);
  }, [showKnowledgeManager]);

  const handleStartEdit = (id: string, name: string, color: KnowledgeBaseColor) => {
    setEditingId(id);
    setEditingName(name);
    setEditingColor(color);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      updateKnowledgeBase(editingId, {
        name: editingName.trim(),
        color: editingColor
      });
      setEditingId(null);
    }
  };

  const handleCreate = () => {
    if (editingName.trim()) {
      addKnowledgeBase(editingName.trim(), editingColor);
      setIsCreating(false);
      setEditingName('');
      setEditingColor('blue');
    }
  };

  if (!showKnowledgeManager) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Bases</h2>
          <button
            onClick={() => setShowKnowledgeManager(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isCreating ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Knowledge Base Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditingColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.bg} ${
                        editingColor === color.value ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!editingName.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
            >
              <Plus size={20} />
              <span>Create New Knowledge Base</span>
            </button>
          )}

          <div className="space-y-6">
            {knowledgeBases.map((kb) => (
              <div key={kb.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  {editingId === kb.id ? (
                    <div className="flex-1 flex items-center gap-4">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        {COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setEditingColor(color.value)}
                            className={`w-6 h-6 rounded-full ${color.bg} ${
                              editingColor === color.value ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                            }`}
                            title={color.label}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Check size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-${kb.color}-500`} />
                        <h3 className="text-lg font-medium text-gray-900">{kb.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(kb.id, kb.name, kb.color)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteKnowledgeBase(kb.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Artifacts */}
                <div className="space-y-2">
                  {artifacts
                    .filter(a => kb.artifactIds.includes(a.id))
                    .map(artifact => (
                      <div key={artifact.id} className="flex items-center justify-between">
                        <ArtifactItem
                          artifact={artifact}
                          onClick={() => navigateToArtifact(artifact)}
                        />
                        <button
                          onClick={() => removeArtifactFromKnowledgeBase(kb.id, artifact.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};