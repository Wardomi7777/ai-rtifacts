import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, MessageSquare } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { formatDistanceToNow } from 'date-fns';

export const ChatSelector: React.FC = () => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { chats, currentChatId, addChat, deleteChat, renameChat, setCurrentChat } = useChatStore();

  const handleStartEdit = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingChatId && editingName.trim()) {
      renameChat(editingChatId, editingName.trim());
      setEditingChatId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
        </div>
        <button
          onClick={() => addChat()}
          className="p-1.5 text-purple-600 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          title="New Chat"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`group rounded-lg transition-colors ${
              chat.id === currentChatId ? 'bg-purple-50' : 'hover:bg-gray-50'
            }`}
          >
            <div
              onClick={() => setCurrentChat(chat.id)}
              className="w-full p-3 flex items-start gap-3 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                {editingChatId === chat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit();
                      }}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="font-medium text-gray-900 truncate">
                      {chat.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                    </div>
                  </>
                )}
              </div>
              {!editingChatId && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(chat.id, chat.name);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 size={16} />
                  </button>
                  {chat.id !== currentChatId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};