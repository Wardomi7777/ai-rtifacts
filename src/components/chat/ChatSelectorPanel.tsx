import React from 'react';
import { X } from 'lucide-react';
import { ChatSelector } from './ChatSelector';

interface ChatSelectorPanelProps {
  onClose: () => void;
}

export const ChatSelectorPanel: React.FC<ChatSelectorPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose}>
      <div 
        className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Workspaces</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ChatSelector />
          </div>
        </div>
      </div>
    </div>
  );
};