import { create } from 'zustand';
import { KnowledgeBase, KnowledgeBaseColor } from '../types/knowledge';
import { StorageService } from '../services/storage/StorageService';

interface KnowledgeStore {
  knowledgeBases: KnowledgeBase[];
  showKnowledgeManager: boolean;
  selectedKnowledgeBase: KnowledgeBase | null;
  setShowKnowledgeManager: (show: boolean) => void;
  setSelectedKnowledgeBase: (kb: KnowledgeBase | null) => void;
  addKnowledgeBase: (name: string, color: KnowledgeBaseColor) => void;
  updateKnowledgeBase: (id: string, updates: Partial<KnowledgeBase>) => void;
  deleteKnowledgeBase: (id: string) => void;
  addArtifactToKnowledgeBase: (knowledgeBaseId: string, artifactId: string) => void;
  removeArtifactFromKnowledgeBase: (knowledgeBaseId: string, artifactId: string) => void;
}

// Load initial knowledge bases from storage
const initialKnowledgeBases = StorageService.loadKnowledgeBases();

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeBases: initialKnowledgeBases,
  showKnowledgeManager: false,
  selectedKnowledgeBase: null,
  setShowKnowledgeManager: (show) => set({ showKnowledgeManager: show }),
  setSelectedKnowledgeBase: (kb) => set({ selectedKnowledgeBase: kb }),
  addKnowledgeBase: (name, color) => set((state) => {
    const newKnowledgeBase: KnowledgeBase = {
      id: crypto.randomUUID(),
      name,
      color,
      artifactIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newKnowledgeBases = [...state.knowledgeBases, newKnowledgeBase];
    StorageService.saveKnowledgeBases(newKnowledgeBases);
    return { knowledgeBases: newKnowledgeBases };
  }),
  updateKnowledgeBase: (id, updates) => set((state) => {
    const newKnowledgeBases = state.knowledgeBases.map((kb) =>
      kb.id === id
        ? { ...kb, ...updates, updatedAt: new Date().toISOString() }
        : kb
    );
    StorageService.saveKnowledgeBases(newKnowledgeBases);
    return { knowledgeBases: newKnowledgeBases };
  }),
  deleteKnowledgeBase: (id) => set((state) => {
    const newKnowledgeBases = state.knowledgeBases.filter((kb) => kb.id !== id);
    StorageService.saveKnowledgeBases(newKnowledgeBases);
    return { knowledgeBases: newKnowledgeBases };
  }),
  addArtifactToKnowledgeBase: (knowledgeBaseId, artifactId) => set((state) => {
    const newKnowledgeBases = state.knowledgeBases.map((kb) =>
      kb.id === knowledgeBaseId && !kb.artifactIds.includes(artifactId)
        ? {
            ...kb,
            artifactIds: [...kb.artifactIds, artifactId],
            updatedAt: new Date().toISOString()
          }
        : kb
    );
    StorageService.saveKnowledgeBases(newKnowledgeBases);
    return { knowledgeBases: newKnowledgeBases };
  }),
  removeArtifactFromKnowledgeBase: (knowledgeBaseId, artifactId) => set((state) => {
    const newKnowledgeBases = state.knowledgeBases.map((kb) =>
      kb.id === knowledgeBaseId
        ? {
            ...kb,
            artifactIds: kb.artifactIds.filter((id) => id !== artifactId),
            updatedAt: new Date().toISOString()
          }
        : kb
    );
    StorageService.saveKnowledgeBases(newKnowledgeBases);
    return { knowledgeBases: newKnowledgeBases };
  })
}));