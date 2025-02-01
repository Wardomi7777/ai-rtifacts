import { create } from 'zustand';

interface QuoteStore {
  quotedArtifacts: Set<string>;
  quotedContents: Map<string, string>;
  toggleQuotedArtifact: (artifactId: string) => void;
  clearQuotedArtifacts: () => void;
  setQuotedContent: (artifactId: string, content: string) => void;
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  quotedArtifacts: new Set(),
  quotedContents: new Map(),
  toggleQuotedArtifact: (artifactId) => set((state) => {
    const newQuoted = new Set(state.quotedArtifacts);
    const newContents = new Map(state.quotedContents);
    if (newQuoted.has(artifactId)) {
      newQuoted.delete(artifactId);
      newContents.delete(artifactId);
    } else {
      newQuoted.add(artifactId);
    }
    return { 
      quotedArtifacts: newQuoted,
      quotedContents: newContents
    };
  }),
  clearQuotedArtifacts: () => set({ 
    quotedArtifacts: new Set(),
    quotedContents: new Map()
  }),
  setQuotedContent: (artifactId, content) => set((state) => ({
    quotedContents: new Map(state.quotedContents).set(artifactId, content)
  })),
}));