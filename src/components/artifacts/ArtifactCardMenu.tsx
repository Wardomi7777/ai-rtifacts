import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Trash2, Share2, Quote, Wand2, Database } from 'lucide-react';
import { ArtifactData } from '../../types/artifacts';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useChatStore } from '../../store/useChatStore';
import { ArtifactTypeSelector } from '../chat/ArtifactTypeSelector';
import { extractArtifactContent } from '../../services/artifacts/utils/contentExtractor';
import { KnowledgeBaseMenu } from './KnowledgeBaseMenu';

interface ArtifactCardMenuProps {
  artifact: ArtifactData;
  onClose: () => void;
}

export const ArtifactCardMenu: React.FC<ArtifactCardMenuProps> = ({ 
  artifact, 
  onClose 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showTransform, setShowTransform] = useState(false);
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(artifact.title || '');
  const { deleteArtifact, updateArtifact } = useArtifactStore();
  const { currentChatId } = useChatStore();
  const { generateArtifact } = useArtifactStore();

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    
    await updateArtifact({
      ...artifact,
      title: newTitle.trim()
    });
    
    setIsRenaming(false);
    onClose();
  };

  const handleTransform = async (type: ArtifactType) => {
    const content = extractArtifactContent(artifact);
    if (content) {
      await generateArtifact(content, type);
      setShowTransform(false);
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    {
      icon: Quote,
      label: 'Quote in Chat',
      onClick: () => {
        if (currentChatId) {
          useChatStore.getState().addArtifactToChat(currentChatId, artifact.id);
        }
        onClose();
      }
    },
    {
      icon: Database,
      label: 'Add to Knowledge Base',
      onClick: () => setShowKnowledgeMenu(true)
    },
    {
      icon: Pencil,
      label: 'Rename',
      onClick: () => setIsRenaming(true)
    },
    {
      icon: Wand2,
      label: 'Transform',
      onClick: () => setShowTransform(true)
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: () => {
        // TODO: Implement share functionality
        onClose();
      }
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => {
        deleteArtifact(artifact.id);
        onClose();
      },
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 overflow-visible"
    > 
      {isRenaming ? (
        <div className="p-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new title"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsRenaming(false)}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              className="px-2 py-1 text-sm text-purple-600 hover:text-purple-900"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                item.className || 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
          
          {showTransform && (
            <div className="absolute left-full top-0 ml-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Transform to:</h3>
                <ArtifactTypeSelector
                  selected={artifact.type}
                  onSelect={handleTransform}
                />
              </div>
            </div>
          )}
          
          {showKnowledgeMenu && (
            <KnowledgeBaseMenu
              artifactId={artifact.id}
              onClose={() => {
                setShowKnowledgeMenu(false);
                onClose();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};