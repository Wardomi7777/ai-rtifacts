import React from 'react';
import { LayoutArtifact } from '../../../types/artifacts';
import { Globe, Tag } from 'lucide-react';

interface LayoutPreviewProps {
  artifact: LayoutArtifact;
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({ artifact }) => {
  return (
    <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
      {/* Preview */}
      <div className="flex-1 p-4">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>${artifact.code.css}</style>
              </head>
              <body class="theme-${artifact.metadata?.theme || 'light'}">
                ${artifact.code.html}
              </body>
            </html>
          `}
          className="w-full h-full border-0 rounded-lg bg-gray-50"
          title="Layout Preview"
        />
      </div>

      {/* Features */}
      {artifact.metadata?.tags && artifact.metadata.tags.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-gray-400" />
            {artifact.metadata.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
              >
                {tag}
              </span>
            ))}
            {artifact.metadata.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{artifact.metadata.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};