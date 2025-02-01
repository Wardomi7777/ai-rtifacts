import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';
import { SearchArtifact } from '../../types/artifacts';

interface SearchRendererProps {
  data: SearchArtifact;
}

export const SearchRenderer: React.FC<SearchRendererProps> = ({ data }) => {
  const hasSources = Array.isArray(data.sources) && data.sources.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main content */}
      <article className="prose max-w-none bg-white rounded-lg shadow-sm p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.content}
        </ReactMarkdown>
      </article>

      {/* Sources */}
      {hasSources && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sources</h2>
          <div className="space-y-4">
            {data.sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <ExternalLink className="flex-shrink-0 w-5 h-5 mt-1 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">{source.title}</h3>
                    {source.snippet && (
                      <p className="text-sm text-gray-600 line-clamp-2">{source.snippet}</p>
                    )}
                    <span className="text-sm text-gray-400 break-all">{source.url}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};