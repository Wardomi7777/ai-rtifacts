import React from 'react';
import { ImageArtifact } from '../../types/artifacts';

interface ImageRendererProps {
  data: ImageArtifact;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Image Preview */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <img
          src={data.imageUrl}
          alt={data.prompt}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>

      {/* Generation Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Generation Details</h2>
        
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Prompt</h3>
            <p className="mt-1 text-gray-600">{data.prompt}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Model</h3>
              <p className="mt-1 text-gray-600">{data.model}</p>
            </div>
            
            {data.size && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Size</h3>
                <p className="mt-1 text-gray-600">{data.size}</p>
              </div>
            )}
            
            {data.quality && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Quality</h3>
                <p className="mt-1 text-gray-600">{data.quality}</p>
              </div>
            )}
            
            {data.style && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Style</h3>
                <p className="mt-1 text-gray-600">{data.style}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};