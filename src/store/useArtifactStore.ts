import { create } from 'zustand';
import { ArtifactData, ArtifactType } from '../types/artifacts';
import { Message, Chat } from '../types/chat';
import { ArtifactService } from '../services/artifacts/ArtifactService';
import { SummaryService } from '../services/artifacts/SummaryService';
import { extractArtifactContent } from '../services/artifacts/utils/contentExtractor';
import { AudioStorage } from '../services/storage/AudioStorage';
import { useChatStore } from './useChatStore';
import { StorageService } from '../services/storage/StorageService'; 
import { ArtifactManager } from '../services/artifacts/ArtifactManager';

// Load initial artifacts from storage and chat history
const savedArtifacts = StorageService.loadArtifacts();
const chatArtifacts = useChatStore.getState().chats.flatMap(chat => 
  chat.messages
    .filter(m => m.artifactData)
    .map(m => m.artifactData!)
);

// Combine and deduplicate artifacts
const initialArtifacts = Array.from(
  new Map([...savedArtifacts, ...chatArtifacts].map(a => [a.id, a])).values()
);

interface ArtifactStore {
  artifacts: ArtifactData[],
  searchQuery: string;
  selectedType: ArtifactType | null;
  question: string;
  quotedMessages: Set<string>;
  imageData: { file: File; url: string; description?: string } | null;
  artifactType: ArtifactType;
  currentArtifact: ArtifactData | null;
  showingArtifact: boolean;
  loading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: ArtifactType | null) => void;
  setQuestion: (question: string) => void;
  setImageData: (data: { file: File; url: string; description?: string } | null) => void;
  toggleQuotedMessage: (messageId: string) => void;
  clearQuotedMessages: () => void;
  setArtifactType: (type: ArtifactType) => void;
  setCurrentArtifact: (data: ArtifactData | null) => void;
  setShowingArtifact: (showing: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateArtifact: (artifactData: ArtifactData) => void;
  filterBySpace: (artifactIds: string[]) => void;
  deleteArtifact: (id: string) => void;
  generateArtifact: (question: string, type: ArtifactType, userMessage?: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
}

export const useArtifactStore = create<ArtifactStore>((set, get) => ({
  artifacts: initialArtifacts,
  searchQuery: '',
  selectedType: null,
  question: '',
  quotedMessages: new Set(),
  imageData: null,
  artifactType: 'ask',
  currentArtifact: null,
  showingArtifact: false,
  loading: false,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedType: (selectedType) => set({ selectedType }),
  setQuestion: (question) => set({ question }),
  setImageData: (imageData) => set({ imageData }),
  toggleQuotedMessage: (messageId) => set(state => {
    const newQuoted = new Set(state.quotedMessages);
    if (newQuoted.has(messageId)) {
      newQuoted.delete(messageId);
    } else {
      newQuoted.add(messageId);
    }
    return { quotedMessages: newQuoted };
  }),
  clearQuotedMessages: () => set({ quotedMessages: new Set() }),
  setArtifactType: (artifactType) => set({ artifactType }),
  setCurrentArtifact: (currentArtifact) => set({ currentArtifact }),
  setShowingArtifact: (showingArtifact) => set({ showingArtifact }),
  setLoading: (loading) => set({ loading }),
  filterBySpace: (artifactIds) => set(state => ({
    artifacts: state.artifacts.filter(a => artifactIds.includes(a.id))
  })),
  updateArtifact: async (artifactData) => {
    try {
      const artifactManager = ArtifactManager.getInstance();
      const updated = await artifactManager.updateArtifact({
        ...artifactData,
        metadata: {
          ...artifactData.metadata,
          lastUpdated: new Date().toISOString()
        }
      });
      
      set(state => ({
        artifacts: state.artifacts.map(a => a.id === updated.id ? updated : a),
        currentArtifact: state.currentArtifact?.id === updated.id ? updated : state.currentArtifact
      }));

      return updated;
    } catch (error) {
      console.error('Failed to update artifact:', error);
      throw error;
    }
  },
  deleteArtifact: (id) => set(state => {
    const { deleteArtifactFromMessages } = useChatStore.getState();
    deleteArtifactFromMessages(id);
    
    // Clean up audio storage if it's a voice artifact
    const artifact = state.artifacts.find(a => a.id === id);
    if (artifact?.type === 'voice') {
      AudioStorage.removeAudio(id);
    }

    const newArtifacts = state.artifacts.filter(a => a.id !== id);
    StorageService.saveArtifacts(newArtifacts);
    return {
      artifacts: newArtifacts,
      currentArtifact: state.currentArtifact?.id === id ? null : state.currentArtifact,
      showingArtifact: state.currentArtifact?.id === id ? false : state.showingArtifact
    };
  }),
  generateArtifact: async (question, type, userMessage) => {
    const store = get();
    set({ loading: true });

    // Check if required API keys are available for specific artifact types
    const keys = localStorage.getItem('api_keys');
    const apiKeys = keys ? JSON.parse(keys) : {};

    if (type === 'search' && !apiKeys.perplexity) {
      addMessageToCurrentChat({
        content: 'Search functionality requires a Perplexity API key. Please add your API key in the settings.',
        isUser: false
      });
      set({ loading: false });
      return;
    }

    if (type === 'voice' && !apiKeys.elevenlabs) {
      addMessageToCurrentChat({
        content: 'Voice functionality requires an ElevenLabs API key. Please add your API key in the settings.',
        isUser: false
      });
      set({ loading: false });
      return;
    }

    const { addMessageToCurrentChat, currentChatId, setChatOpen } = useChatStore.getState(); 
    
    // Save artifact to storage after generation
    const saveArtifact = (artifactData: ArtifactData) => {
      set(state => {
        const newArtifacts = [...state.artifacts, artifactData];
        StorageService.saveArtifacts(newArtifacts);
        return { artifacts: newArtifacts };
      });
    };

    const imageData = store.imageData;
    
    // Special handling for macro execution
    if (type === 'macro') {
      try {
        const artifactService = new ArtifactService();
        const macroData = await artifactService.generateArtifact(question, type);
        
        // Save macro artifact
        saveArtifact(macroData);

        // Add macro message
        addMessageToCurrentChat({
          content: `Created macro: ${macroData.title}\n${macroData.description}`,
          isUser: false,
          artifactData: macroData
        });

        // Add to current chat
        if (currentChatId) {
          addArtifactToChat(currentChatId, macroData.id);
        }

        return macroData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create macro';
        addMessageToCurrentChat({
          content: errorMessage,
          isUser: false
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    }

    // Build question with quotes
    let fullQuestion = question;
    let references = [];
    
    if (store.quotedMessages.size > 0) {
      const { currentChatId, chats } = useChatStore.getState();
      const currentChat = chats.find(c => c.id === currentChatId);
      const quotes = currentChat?.messages
        .filter(m => store.quotedMessages.has(m.id))
        .map(m => ({
          content: m.content,
          artifactData: m.artifactData,
          reference: {
            type: 'quote' as const,
            title: m.artifactData?.title || m.content.slice(0, 30) + '...',
            artifactType: m.artifactData?.type
          }
        })) || [];
      
      // Add quotes to the question for LLM context
      fullQuestion += '\n\nQuoted content:\n' + quotes.map(q => {
        let content = q.content;
        if (q.artifactData) {
          const artifactContent = extractArtifactContent(q.artifactData);
          if (artifactContent) {
            content += '\n' + artifactContent;
          }
        }
        return content;
      }).join('\n\n---\n\n');

      // Create references for the message
      references = quotes.map(q => q.reference);
    }

    
    // Only add user message if not part of a macro execution
    if (!userMessage?.isMacroStep) {
      addMessageToCurrentChat(userMessage ? {
        ...userMessage,
        imageUrl: imageData?.url,
        references
      } : {
        content: question,
        isUser: true,
        imageUrl: imageData?.url,
        references
      });
    }
    
    // Clear quoted messages after sending
    set({ 
      quotedMessages: new Set(),
      imageData: null
    });
    
    // Special handling for chat artifacts
    if (type === 'chat') {
      try {
        const artifactService = new ArtifactService();
        const chatData = await artifactService.generateArtifact(question, type);
        
        // Save chat artifact
        saveArtifact(chatData);

        // Add chat message
        addMessageToCurrentChat({
          content: `Created new chat: ${chatData.title}`,
          isUser: false,
          artifactData: chatData
        });

        return chatData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
        addMessageToCurrentChat({
          content: errorMessage,
          isUser: false
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    }
    
    try {
      const artifactService = new ArtifactService();
      const questionWithContext = imageData?.description 
        ? `${question}\n\nImage context: ${imageData.description}`
        : fullQuestion;
      const { currentChatId, chats } = useChatStore.getState();
      const currentChat = chats.find(c => c.id === currentChatId);
      const messages = currentChat?.messages || [];

      const artifactData = await artifactService.generateArtifact(
        questionWithContext,
        type,
        messages,
        userMessage?.chatInstructions
      ).catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate artifact';
        addMessageToCurrentChat({
          content: errorMessage,
          isUser: false
        });
        set({ loading: false });
        throw error;
      });

      // Add to artifacts list and save
      set(state => {
        const newArtifacts = [...state.artifacts, artifactData];
        const { addArtifactToChat } = useChatStore.getState();
        // Add to current chat
        if (currentChatId) {
          addArtifactToChat(currentChatId, artifactData.id);
        }
        StorageService.saveArtifacts(newArtifacts);
        return { artifacts: newArtifacts };
      });

      let messageContent = '';
      
      if (['ask', 'think', 'search', 'layout', 'image', 'voice', 'macro'].includes(type)) {
        messageContent = artifactData.content;
        if (type === 'layout') {
          messageContent = `Generated layout with ${
            artifactData.metadata?.tags?.length || 0
          } features: ${artifactData.metadata?.tags?.join(', ') || 'none'}`;
        } else if (type === 'image') {
          messageContent = ''; // Empty content for images - they'll be displayed directly
        } else if (type === 'voice') {
          messageContent = ''; // Empty content for voice - it'll be displayed with audio player
        } else if (type === 'macro') {
          messageContent = `Created macro: ${artifactData.title}\n${artifactData.description}`;
        }
      } else if (type === 'remote') {
        messageContent = `${artifactData.title}\n${artifactData.description}\n\n${artifactData.method} ${artifactData.url}`;
      } else if (type === 'code') {
        messageContent = `Generated ${artifactData.language} code: ${artifactData.title}\n${artifactData.description}`;
      } else if (type === 'chat') {
        messageContent = `Created new chat: ${artifactData.title}`;
      } else {
        const summaryService = new SummaryService();
        const summary = await summaryService.generateSummary(artifactData);
        messageContent = `${summary.title}\n${summary.summary}`;
      }
      
      addMessageToCurrentChat({
        content: messageContent,
        isUser: false,
        artifactData: ['ask', 'think'].includes(type) && !['image', 'voice', 'macro', 'code', 'chat'].includes(type) ? undefined : artifactData
      });

      // For chat artifacts, automatically open the chat drawer
      if (type === 'chat') {
        setChatOpen(true);
      }

      return artifactData;
    } catch (error) {
      addMessageToCurrentChat({
        content: error instanceof Error ? error.message : 'Failed to generate artifact',
        isUser: false
      });
    } finally {
      set({ loading: false });
    }
  },
}));