import React from 'react';
import { Clock, User, Tag } from 'lucide-react';

interface DocumentHeaderProps {
  title?: string;
  description?: string;
  metadata?: {
    lastUpdated?: string;
    author?: string;
    tags?: string[];
  };
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  description,
  metadata,
}) => {
  return (
    <header className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      {title && (
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      )}
      
      {description && (
        <p className="text-lg text-gray-600">{description}</p>
      )}

      {metadata && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {metadata.lastUpdated && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                {new Date(metadata.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {metadata.author && (
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{metadata.author}</span>
            </div>
          )}
          
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};