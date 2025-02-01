import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useArtifactStore } from '../store/useArtifactStore';
import { useNavigate } from '../hooks/useNavigate';
import { DocumentRenderer } from './renderers/DocumentRenderer';
import { SpreadsheetRenderer } from './renderers/SpreadsheetRenderer';
import { DiagramRenderer } from './renderers/DiagramRenderer';
import { FormRenderer } from './renderers/FormRenderer';
import { SearchRenderer } from './renderers/SearchRenderer';
import { LayoutRenderer } from './renderers/LayoutRenderer';
import { ImageRenderer } from './renderers/ImageRenderer';
import { VoiceRenderer } from './renderers/VoiceRenderer';
import { MacroRenderer } from './renderers/MacroRenderer';
import { CodeRenderer } from './renderers/CodeRenderer';
import { RemoteRenderer } from './renderers/RemoteRenderer';
import { ChatRenderer } from './renderers/ChatRenderer';

export const ArtifactViewer: React.FC = () => {
  const { currentArtifact } = useArtifactStore();
  const { navigateToChat } = useNavigate();

  if (!currentArtifact) {
    return null;
  }

  const renderers = {
    ask: ({ data }) => (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
      </div>
    ),
    think: ({ data }) => (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
      </div>
    ),
    document: DocumentRenderer,
    spreadsheet: SpreadsheetRenderer,
    diagram: DiagramRenderer,
    form: FormRenderer,
    search: SearchRenderer,
    layout: LayoutRenderer,
    image: ImageRenderer,
    voice: VoiceRenderer,
    macro: MacroRenderer,
    code: CodeRenderer,
    remote: RemoteRenderer,
    chat: ChatRenderer
  };

  const Renderer = renderers[currentArtifact.type] as React.ComponentType<{ data: typeof currentArtifact }>;
  
  if (!Renderer) {
    console.error(`No renderer found for artifact type: ${currentArtifact.type}`);
    return (
      <div className="text-red-600 p-4">
        Unsupported artifact type: {currentArtifact.type}
      </div>
    );
  }

  return (
    <>
      <header className="bg-white/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <button
            onClick={navigateToChat}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to chat</span>
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          <Renderer data={currentArtifact} />
        </div>
      </main>
    </>
  );
};