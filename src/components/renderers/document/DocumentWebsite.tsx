import React, { useState, useEffect } from 'react';
import { useWebsiteGeneration } from '../../../hooks/useWebsiteGeneration';
import { WebsiteRenderer } from './website/WebsiteRenderer';
import { DocumentArtifact } from '../../../types/artifacts';
import { Loader } from 'lucide-react';

interface DocumentWebsiteProps {
  data: DocumentArtifact;
  onClose: () => void;
}

export const DocumentWebsite: React.FC<DocumentWebsiteProps> = ({ data, onClose }) => {
  const { generateWebsite, loading, error } = useWebsiteGeneration();
  const [websiteData, setWebsiteData] = useState<any>(null);

  useEffect(() => {
    const generate = async () => {
      const result = await generateWebsite(data);
      if (result) {
        setWebsiteData(result);
      }
    };

    generate();
  }, [data]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
            <p className="mt-4 text-gray-600">Generating website layout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md text-center px-4">
            <p className="text-red-600 font-medium">Error generating website:</p>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!websiteData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <WebsiteRenderer data={websiteData} onClose={onClose} />
    </div>
  );
};