import React from 'react';
import { ArtifactType } from '../../types/artifacts';
import { typeConfig, artifactTypes } from '../../config/artifactTypes';

interface ArtifactTypeSelectorProps {
  selected: ArtifactType;
  onSelect: (type: ArtifactType) => void;
}

export const ArtifactTypeSelector: React.FC<ArtifactTypeSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {artifactTypes.map((type) => {
        const config = typeConfig[type];
        const Icon = config.icon;
        return (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors ${
            selected === type 
              ? `bg-gradient-to-r ${config.gradient} text-white` 
              : `${config.color} ${config.hover}`
          }`}
        >
          <Icon size={18} className={selected === type ? 'text-white' : ''} />
          <span>{config.label}</span>
        </button>
      )})}
    </div>
  );
};