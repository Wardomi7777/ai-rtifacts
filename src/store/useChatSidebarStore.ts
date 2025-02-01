import { create } from 'zustand';

interface ChatSidebarStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useChatSidebarStore = create<ChatSidebarStore>((set) => ({
  isOpen: false, // Start collapsed by default
  setIsOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));