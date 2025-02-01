import React, { useState, useEffect, useRef } from 'react';
import { Eye, Code, Sun, Moon } from 'lucide-react';
import { LayoutArtifact } from '../../types/artifacts';
import { useArtifactStore } from '../../store/useArtifactStore';

interface LayoutRendererProps {
  data: LayoutArtifact;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ data }) => {
  const [showCode, setShowCode] = useState(false);
  const [theme, setTheme] = useState(data.metadata?.theme || 'light');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { code } = data;
  const { updateArtifact } = useArtifactStore();

  if (!code || !code.html || !code.css) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Invalid layout data: Missing required code
      </div>
    );
  }

  useEffect(() => {
    // Update preview when mounted
    updateArtifact({
      ...data,
      preview: {
        lastRendered: new Date().toISOString()
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateArtifact({
      ...data,
      metadata: {
        ...data.metadata,
        theme: newTheme
      }
    });
  };

  // Handle iframe navigation
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      // Add event listener for clicks inside iframe
      iframe.contentWindow?.document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        
        if (anchor) {
          const href = anchor.getAttribute('href');
          if (href?.startsWith('#')) {
            e.preventDefault();
            // Scroll to element inside iframe
            const element = iframe.contentWindow?.document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    } catch (err) {
      console.error('Failed to add iframe event listeners:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Layout Preview</h2>
            {data.metadata?.tags && (
              <div className="mt-2 flex gap-2">
                {data.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={showCode ? 'Show preview' : 'Show code'}
            >
              {showCode ? <Eye size={20} /> : <Code size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Preview/Code */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {showCode ? (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">HTML</h3>
              <pre className="p-4 bg-gray-50 rounded-lg overflow-x-auto">
                <code>{code.html}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">CSS</h3>
              <pre className="p-4 bg-gray-50 rounded-lg overflow-x-auto">
                <code>{code.css}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className={`w-full min-h-[700px] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              srcDoc={`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <base target="_self">
                  <style>${code.css}</style>
                  <script>
                    // Handle back/forward navigation
                    window.addEventListener('popstate', (e) => {
                      if (e.state?.scrollTo) {
                        const element = document.querySelector(e.state.scrollTo);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }
                    });
                  </script>
                </head>
                <body class="theme-${theme}">
                  ${code.html}
                </body>
                </html>
              `}
              className="w-full h-full border-0 min-h-[700px]"
              title="Layout Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}