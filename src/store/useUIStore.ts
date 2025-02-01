import { create } from 'zustand';

interface UIStore {
  isAnyOverlayOpen: boolean;
  setIsAnyOverlayOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAnyOverlayOpen: false,
  setIsAnyOverlayOpen: (isOpen) => set({ isAnyOverlayOpen: isOpen }),
}));