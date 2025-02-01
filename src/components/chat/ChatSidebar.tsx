import React, { useState } from 'react';
import { MessageSquarePlus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useChatSidebarStore } from '../../store/useChatSidebarStore';
import { formatDistanceToNow } from 'date-fns';

export const ChatSidebar: React.FC = () => {
  const { chats, currentChatId, addChat, deleteChat, renameChat, setCurrentChat } = useChatStore();
  const { isOpen, toggle } = useChatSidebarStore();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingName('');
  };

  return (
    <>
      <div className={`fixed left-0 top-0 h-screen transition-all duration-300 z-[60] ${
        isOpen ? 'w-64' : 'w-16'
      } ${isOpen ? 'bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-lg' : ''}`}>
        <div className="h-full flex flex-col">
          {/* Toggle Button */}
          <button
            onClick={toggle}
            className="absolute right-0 top-16 translate-x-1/2 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <div className="p-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
              <MessageSquarePlus size={20} className={`text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {isOpen && (
            <>
              {/* New Chat Button */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => addChat()}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                >
                  <MessageSquarePlus size={20} />
                  <span>New Chat</span>
                </button>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                      <div className="flex-1 text-left">
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="p-1 text-gray-600 hover:text-gray-700"
                            >
                              <X size={16} />
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
                            className="p-1 text-gray-600 hover:text-gray-700"
                          >
                            <Edit2 size={16} />
                          </button>
                          {chat.id !== currentChatId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.id);
                              }}
                              className="p-1 text-red-600 hover:text-red-700"
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
            </>
          )}
        </div>
      </div>
    </>
  );
};