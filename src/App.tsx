import React from 'react';
import { Layers, FileText, MessageSquare, Database, Key, X } from 'lucide-react';
import { useChatStore } from './store/useChatStore';
import { ArtifactGrid } from './components/artifacts/ArtifactGrid';
import { ArtifactSearch } from './components/artifacts/ArtifactSearch';
import { ChatSelectorPanel } from './components/chat/ChatSelectorPanel';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { ArtifactTypeBar } from './components/artifacts/ArtifactTypeBar';
import { ArtifactViewer } from './components/ArtifactViewer';
import { GradientBackground } from './components/ui/GradientBackground';
import { useArtifactStore } from './store/useArtifactStore';
import { useTemplateStore } from './store/useTemplateStore';
import { useKnowledgeStore } from './store/useKnowledgeStore';
import { APIKeySettings } from './components/settings/APIKeySettings';
import { useUIStore } from './store/useUIStore';
import { TemplateManager } from './components/templates/TemplateManager';
import { KnowledgeManager } from './components/knowledge/KnowledgeManager';

function App() {
  const { showingArtifact } = useArtifactStore();
  const { currentChatId, showChatPanel, setShowChatPanel, isChatOpen, setChatOpen } = useChatStore((state) => ({
    currentChatId: state.currentChatId,
    showChatPanel: state.showChatPanel,
    setShowChatPanel: state.setShowChatPanel,
    isChatOpen: state.isChatOpen,
    setChatOpen: state.setChatOpen
  }));
  const { showTemplateManager, setShowTemplateManager } = useTemplateStore();
  const { showKnowledgeManager, setShowKnowledgeManager } = useKnowledgeStore();
  const { isAnyOverlayOpen } = useUIStore();
  const [hasApiKeys, setHasApiKeys] = React.useState(() => {
    const keys = localStorage.getItem('api_keys'); 
    if (!keys) return false;
    const parsedKeys = JSON.parse(keys);
    return Boolean(parsedKeys.openai); // Only OpenAI key is required
  });
  const [showApiSettings, setShowApiSettings] = React.useState(false);

  // Update overlay state when any panel opens/closes
  React.useEffect(() => {
    useUIStore.getState().setIsAnyOverlayOpen(
      showingArtifact || showChatPanel || showTemplateManager || showKnowledgeManager || showApiSettings
    );
  }, [showingArtifact, showChatPanel, showTemplateManager, showKnowledgeManager, showApiSettings]);

  if (!hasApiKeys) {
    return (
      <GradientBackground>
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LLM Artifact System</h1>
              <p className="text-gray-600">Please configure your API keys to get started</p>
            </header>
            <APIKeySettings />
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      {/* Left Side Buttons */}
      <div className={`fixed top-6 left-6 flex gap-2 z-[55] transition-opacity duration-200 ${
        isAnyOverlayOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <button
          onClick={() => setShowApiSettings(true)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors"
          title="API Settings"
        >
          <Key size={20} />
        </button>
        {!showChatPanel && (
          <button
            onClick={() => setShowChatPanel(true)}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors"
            title="Open Workspaces"
          >
            <Layers size={20} />
          </button>
        )}
        <button
          onClick={() => setChatOpen(!isChatOpen)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors"
          title="Open Chat"
        >
          <MessageSquare size={20} />
        </button>
        <button
          onClick={() => setShowTemplateManager(true)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors"
          title="Manage Templates"
        >
          <FileText size={20} />
        </button>
        <button
          onClick={() => setShowKnowledgeManager(true)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors"
          title="Knowledge Bases"
        >
          <Database size={20} />
        </button>
      </div>

      {/* Chat Selector Panel */}
      {showChatPanel && (
        <ChatSelectorPanel onClose={() => setShowChatPanel(false)} />
      )}

      <main className="min-h-screen p-6">
        {showingArtifact ? (
          <ArtifactViewer />
        ) : (
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <header className="flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Artifacts</h1>
            </header>

            <ArtifactTypeBar />
            <ArtifactSearch />
            <ArtifactGrid />
          </div>
        )}
        
        {/* Chat Drawer */}
        <ChatDrawer />
        
        {/* Template Manager */}
        <TemplateManager />
        
        {/* Knowledge Manager */}
        <KnowledgeManager />
        
        {/* API Settings Modal */}
        {showApiSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
                <button
                  onClick={() => setShowApiSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <APIKeySettings onSave={() => setShowApiSettings(false)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </GradientBackground>
  );
}

export default App;