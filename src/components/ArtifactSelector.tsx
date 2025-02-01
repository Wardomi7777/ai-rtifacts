import React from 'react';
import { ArtifactCard } from './ui/ArtifactCard';
import { ArtifactType } from '../types/artifacts';

interface ArtifactSelectorProps {
  selected: ArtifactType;
  onSelect: (type: ArtifactType) => void;
}

export const ArtifactSelector: React.FC<ArtifactSelectorProps> = ({ selected, onSelect }) => {
  const artifactTypes: ArtifactType[] = ['document', 'spreadsheet', 'diagram'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {artifactTypes.map((type) => (
        <ArtifactCard
          key={type}
          type={type}
          selected={type === selected}
          onClick={() => onSelect(type)}
        />
      ))}
    </div>
  );
};