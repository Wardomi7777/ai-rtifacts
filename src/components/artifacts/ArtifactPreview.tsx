import React from 'react';
import { ArtifactData } from '../../types/artifacts';
import { extractArtifactContent } from '../../services/artifacts/utils/contentExtractor';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Volume2, Search, Globe } from 'lucide-react';
import { MacroPreview } from './previews/MacroPreview';
import { FormPreview } from './previews/FormPreview';
import { LayoutPreview } from './previews/LayoutPreview';
import { SearchPreview } from './previews/SearchPreview';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
});

interface ArtifactPreviewProps {
  artifact: ArtifactData;
}

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-gray-600">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-purple-500 pl-4 italic mb-4">{children}</blockquote>
  ),
  code: ({ inline, children }) => (
    inline ? (
      <code className="bg-gray-100 px-1 rounded text-sm font-mono">{children}</code>
    ) : (
      <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-4">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    )
  )
};

export const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({ artifact }) => {
  const [diagramSvg, setDiagramSvg] = React.useState<string>('');

  // Render mermaid diagram when source changes
  React.useEffect(() => {
    if (artifact.type === 'diagram') {
      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(
            `diagram-${artifact.id}`,
            artifact.source
          );
          setDiagramSvg(svg);
        } catch (error) {
          console.error('Failed to render diagram:', error);
        }
      };
      renderDiagram();
    }
  }, [artifact.type, artifact.source, artifact.id]);

  const renderPreview = () => {
    switch (artifact.type) {
      case 'chat':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900 truncate">{artifact.title}</h3>
              {artifact.description && (
                <p className="text-sm text-gray-500 truncate mt-1">{artifact.description}</p>
              )}
            </div>
            
            {/* Messages Preview */}
            <div className="flex-1 p-4 space-y-3 overflow-hidden">
              {artifact.messages.slice(0, 3).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.isUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="line-clamp-2">{message.content}</div>
                  </div>
                </div>
              ))}
              {artifact.messages.length > 3 && (
                <div className="text-xs text-center text-gray-500">
                  +{artifact.messages.length - 3} more messages
                </div>
              )}
            </div>
          </div>
        );

      case 'layout':
        return <LayoutPreview artifact={artifact as LayoutArtifact} />;

      case 'form':
        return <FormPreview artifact={artifact as FormArtifact} />;

      case 'macro':
        return <MacroPreview artifact={artifact as MacroArtifact} />;

      case 'document':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Content */}
            <div className="flex-1 p-6 overflow-hidden flex items-center justify-center">
              <div className="prose prose-sm max-w-none prose-gray text-center">
                <ReactMarkdown
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                >
                  {artifact.content.slice(0, 300)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Code */}
            <div className="flex-1 p-4 overflow-hidden">
              <SyntaxHighlighter
                language={artifact.language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: '0.5rem', fontSize: '0.875rem' }}
              >
                {artifact.source.slice(0, 300)}
              </SyntaxHighlighter>
            </div>
          </div>
        );

      case 'spreadsheet':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Table */}
            <div className="flex-1 p-4 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {artifact.columns.slice(0, 4).map((col, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {artifact.rows.slice(0, 3).map((row, i) => (
                    <tr key={i}>
                      {row.slice(0, 4).map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-sm text-gray-500 truncate">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'diagram':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Diagram */}
            <div className="flex-1 p-4 flex items-center justify-center">
              {diagramSvg ? (
                <div 
                  className="max-w-full max-h-full [&_svg]:max-w-full [&_svg]:max-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: diagramSvg }}
                />
              ) : (
                <div className="animate-pulse bg-gray-200 rounded w-full h-48" />
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Image */}
            <div className="flex-1 overflow-hidden">
              <img
                src={artifact.imageUrl}
                alt={artifact.prompt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Audio Player */}
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <button className="p-3 rounded-full bg-cyan-500 text-white">
                  <Play size={20} />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Voice Message</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className="h-full w-0 bg-cyan-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'search':
        return <SearchPreview artifact={artifact} />;

      case 'remote':
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
            {/* Response */}
            {artifact.lastResponse && (
              <div className="flex-1 p-4 overflow-hidden">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    artifact.lastResponse.status >= 200 && artifact.lastResponse.status < 300
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {artifact.lastResponse.status} {artifact.lastResponse.statusText}
                  </span>
                </div>
                <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-hidden">
                  {artifact.lastResponse.body.slice(0, 200)}
                </pre>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="h-full bg-white/50 backdrop-blur-sm p-4">
            <p className="text-sm text-gray-600">
              {extractArtifactContent(artifact)?.slice(0, 300)}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {renderPreview()}
    </div>
  );
};