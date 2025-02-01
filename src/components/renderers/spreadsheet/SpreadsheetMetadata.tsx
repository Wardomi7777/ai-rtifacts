import React from 'react';
import { Clock } from 'lucide-react';

interface SpreadsheetMetadataProps {
  title?: string;
  description?: string;
  lastUpdated?: string;
}

export const SpreadsheetMetadata: React.FC<SpreadsheetMetadataProps> = ({
  title,
  description,
  lastUpdated,
}) => {
  if (!title && !description && !lastUpdated) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
      {lastUpdated && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>{new Date(lastUpdated).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};