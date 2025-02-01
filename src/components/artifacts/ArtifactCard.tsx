import React from 'react';
import { MoreVertical, Quote } from 'lucide-react';
import { ArtifactData } from '../../types/artifacts';
import { typeConfig } from '../../config/artifactTypes';
import { ArtifactCardMenu } from './ArtifactCardMenu';
import { formatDistanceToNow } from 'date-fns';
import { extractArtifactContent } from '../../services/artifacts/utils/contentExtractor';
import { useArtifactStore } from '../../store/useArtifactStore';
import { useQuoteStore } from '../../store/useQuoteStore';
import { ArtifactPreview } from './ArtifactPreview';

interface ArtifactCardProps {
  artifact: ArtifactData;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const { setCurrentArtifact, setShowingArtifact } = useArtifactStore();
  const { quotedArtifacts, toggleQuotedArtifact, setQuotedContent } = useQuoteStore();
  const isQuoted = quotedArtifacts.has(artifact.id);

  const handleOpen = () => {
    setCurrentArtifact(artifact);
    setShowingArtifact(true);
  };

  const handleQuote = () => {
    toggleQuotedArtifact(artifact.id);
    const content = extractArtifactContent(artifact);
    if (content) {
      setQuotedContent(artifact.id, content);
    }
  };

  // Extract preview content
  const previewContent = React.useMemo(() => {
    const content = extractArtifactContent(artifact);
    return content ? content.slice(0, 100) + (content.length > 100 ? '...' : '') : '';
  }, [artifact]);

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      {/* Preview Area */}
      <div className="aspect-video w-full overflow-hidden relative">
        {/* Type Icon */}
        <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg ${typeConfig[artifact.type].color} bg-white/80 backdrop-blur-sm z-10`}>
          {React.createElement(typeConfig[artifact.type].icon, { 
            size: typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 20 
          })}
        </div>

        <div 
          onClick={handleOpen}
          className="h-full w-full cursor-pointer hover:bg-gray-50 transition-colors relative group"
        >
          <ArtifactPreview artifact={artifact} />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900">
              Open
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 relative">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {artifact.title || `Untitled ${artifact.type}`}
            </h3>
            {artifact.description && (
              <p className="mt-0.5 sm:mt-1 text-xs text-gray-500 line-clamp-2">
                {artifact.description}
              </p>
            )}
            <p className="mt-0.5 sm:mt-1 text-xs text-gray-500">
              {formatDistanceToNow(new Date(artifact.metadata?.lastUpdated || Date.now()), { 
                addSuffix: true 
              })}
            </p>
          </div>
                    
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-0.5 sm:p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
            </button>
            
            {showMenu && (
              <ArtifactCardMenu 
                artifact={artifact} 
                onClose={() => setShowMenu(false)}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Quote Button */}
      <button
        onClick={handleQuote}
        className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg transition-colors z-10 ${
          isQuoted
            ? 'bg-purple-500 text-white'
            : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100'
        }`}
      >
        <Quote size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};