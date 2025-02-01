import React from 'react';
import { SearchArtifact } from '../../../types/artifacts';
import { ExternalLink } from 'lucide-react';

interface SearchPreviewProps {
  artifact: SearchArtifact;
}

export const SearchPreview: React.FC<SearchPreviewProps> = ({ artifact }) => {
  return (
    <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
      <div className="flex-1 p-4 overflow-hidden space-y-4">
        {artifact.sources.slice(0, 4).map((source, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{source.title}</h3>
              <p className="text-xs text-gray-400 truncate">{source.url}</p>
            </div>
          </div>
        ))}
        {artifact.sources.length > 4 && (
          <div className="text-sm text-gray-500 text-center">
            +{artifact.sources.length - 4} more sources
          </div>
        )}
      </div>
    </div>
  );
};