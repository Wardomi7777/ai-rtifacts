import React, { useState } from 'react';
import mermaid from 'mermaid';
import { DiagramArtifact } from '../../types/artifacts';
import { Loader, Pencil, Eye, Wand2 } from 'lucide-react';
import { useArtifactStore } from '../../store/useArtifactStore';
import { DiagramLLMEditor } from './diagram/DiagramLLMEditor';

interface DiagramRendererProps {
  data: DiagramArtifact;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLLMEditor, setShowLLMEditor] = useState(false);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { updateArtifact } = useArtifactStore();

  const handleContentUpdate = (newSource: string) => {
    const updatedData = {
      ...data,
      source: newSource
    };
    updateArtifact(updatedData);
  };

  const renderDiagram = async (source: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Initialize mermaid with configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
        },
        logLevel: 'error',
        fontFamily: 'Inter, system-ui, sans-serif',
      });

      // Clean and normalize the source
      let cleanSource = source
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .trim();

      // Generate unique ID for this render
      const id = `mermaid-${Math.random().toString(36).substring(2)}`;

      // Render new diagram
      const { svg: renderedSvg } = await mermaid.render(id, cleanSource);
      setSvg(renderedSvg);
      setError(null);
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render diagram');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    renderDiagram(data.source);
  }, [data.source]);

  return (
    <div className="space-y-4">
      {data.title && (
        <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
      )}
      {data.description && (
        <p className="text-gray-600 mb-4">{data.description}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setShowLLMEditor(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isEditing ? (
            <>
              <Eye size={20} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <Pencil size={20} />
              <span>Edit</span>
            </>
          )}
        </button>
        <button
          onClick={() => {
            setShowLLMEditor(!showLLMEditor);
            setIsEditing(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
        >
          <Wand2 size={20} />
          <span>AI Edit</span>
        </button>
      </div>

      <div className="w-full">
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <textarea
              value={data.source}
              onChange={(e) => handleContentUpdate(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter Mermaid diagram source..."
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                <p className="font-medium">Error rendering diagram:</p>
                <p className="mt-1">{error}</p>
              </div>
            ) : (
              <div
                className="flex justify-center items-center min-h-[300px] [&_svg]:max-w-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
          </div>
        )}

        {showLLMEditor && (
          <DiagramLLMEditor
            source={data.source}
            onUpdate={handleContentUpdate}
          />
        )}
      </div>
    </div>
  );
};