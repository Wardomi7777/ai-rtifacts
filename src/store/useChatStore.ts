import { create } from 'zustand';
import { Chat, Message } from '../types/chat';
import { ArtifactData } from '../types/artifacts';
import { StorageService } from '../services/storage/StorageService';

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  showChatPanel: boolean;
  isChatOpen: boolean;
  setCurrentChat: (chatId: string) => void;
  setShowChatPanel: (show: boolean) => void;
  setChatOpen: (isOpen: boolean) => void;
  addChat: (name?: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, name: string) => void;
  deleteArtifactFromMessages: (artifactId: string) => void;
  addMessageToCurrentChat: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessageArtifact: (artifactData: ArtifactData) => void;
  addArtifactToChat: (chatId: string, artifactId: string) => void;
}

// Load initial chats from storage
const savedChats = StorageService.loadChats();
const initialChat = savedChats.length > 0 ? savedChats : [{
  id: crypto.randomUUID(),
  name: 'New Chat',
  createdAt: new Date().toISOString(),
  messages: []
}];

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: initialChat,
  currentChatId: initialChat[0].id,
  showChatPanel: false,
  isChatOpen: false,

  setCurrentChat: (chatId) => set({ currentChatId: chatId }),

  setShowChatPanel: (show) => set({ showChatPanel: show }),

  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

  addChat: (name = 'New Chat') => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      messages: []
    };

    set(state => {
      const newState = {
        chats: [...state.chats, newChat],
        currentChatId: newChat.id
      };
      StorageService.saveChats(newState.chats);
      return newState;
    });
  },

  deleteChat: (chatId) => {
    set(state => {
      const newChats = state.chats.filter(chat => chat.id !== chatId);
      const newCurrentChatId = state.currentChatId === chatId
        ? newChats[0]?.id || null
        : state.currentChatId;

      StorageService.saveChats(newChats);
      return {
        chats: newChats,
        currentChatId: newCurrentChatId
      };
    });
  },

  renameChat: (chatId, name) => {
    set(state => {
      const newChats = state.chats.map(chat =>
        chat.id === chatId ? { ...chat, name } : chat
      );
      StorageService.saveChats(newChats);
      return { chats: newChats };
    });
  },

  deleteArtifactFromMessages: (artifactId) => {
    set(state => {
      const newChats = state.chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(message => ({
          ...message,
          artifactData: message.artifactData?.id === artifactId ? undefined : message.artifactData
        }))
      }));
      StorageService.saveChats(newChats);
      return { chats: newChats };
    });
  },

  addMessageToCurrentChat: (message) => {
    set(state => {
      const currentChatId = state.currentChatId;
      if (!currentChatId) return state;

      const newChats = state.chats.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                ...message,
                id: crypto.randomUUID(),
                timestamp: Date.now()
              }
            ]
          };
        }
        return chat;
      });

      StorageService.saveChats(newChats);
      return { chats: newChats };
    });
  },

  updateMessageArtifact: (artifactData) => {
    set(state => {
      const currentChatId = state.currentChatId;
      if (!currentChatId) return state;

      const newChats = state.chats.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: chat.messages.map(message => {
              if (message.artifactData?.id === artifactData.id) {
                return {
                  ...message,
                  artifactData
                };
              }
              return message;
            })
          };
        }
        return chat;
      });

      StorageService.saveChats(newChats);
      return { chats: newChats };
    });
  },

  addArtifactToChat: (chatId, artifactId) => {
    set(state => {
      const newChats = state.chats.map(chat => {
        if (chat.id === chatId) {
          // Find the last message with this artifact
          const lastArtifactMessage = [...chat.messages]
            .reverse()
            .find(m => m.artifactData?.id === artifactId);

          if (!lastArtifactMessage) return chat;

          // Add a reference message
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: crypto.randomUUID(),
                content: `Added ${lastArtifactMessage.artifactData?.type} to chat`,
                isUser: false,
                timestamp: Date.now(),
                artifactData: lastArtifactMessage.artifactData
              }
            ]
          };
        }
        return chat;
      });

      StorageService.saveChats(newChats);
      return { chats: newChats };
    });
  }
}));