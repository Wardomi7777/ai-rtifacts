import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useArtifactStore } from '../../store/useArtifactStore';
import { artifactTypes, typeConfig } from '../../config/artifactTypes';

export const ArtifactSearch: React.FC = () => {
  const { searchQuery, setSearchQuery, selectedType, setSelectedType } = useArtifactStore();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search artifacts..."
          className="block w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Type Filter */}
      <div className="relative">
        <select
          value={selectedType || ''}
          onChange={(e) => setSelectedType(e.target.value as ArtifactType || null)}
          className="appearance-none pl-9 sm:pl-10 pr-8 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-auto"
        >
          <option value="">All Types</option>
          {artifactTypes.map(type => (
            <option key={type} value={type}>
              {typeConfig[type].label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};