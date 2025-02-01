import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface TimelineHeaderProps {
  title?: string;
  description?: string;
  metadata?: {
    startDate?: string;
    endDate?: string;
    lastUpdated?: string;
  };
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  title,
  description,
  metadata,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
      {metadata && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {(metadata.startDate || metadata.endDate) && (
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {metadata.startDate && metadata.endDate
                  ? `${new Date(metadata.startDate).toLocaleDateString()} - ${new Date(metadata.endDate).toLocaleDateString()}`
                  : metadata.startDate
                    ? `From ${new Date(metadata.startDate).toLocaleDateString()}`
                    : `Until ${new Date(metadata.endDate).toLocaleDateString()}`
                }
              </span>
            </div>
          )}
          {metadata.lastUpdated && (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Updated {new Date(metadata.lastUpdated).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};