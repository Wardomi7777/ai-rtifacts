import React from 'react';
import { ArtifactType } from '../../types/artifacts';
import { typeConfig } from '../../config/artifactTypes';

interface ArtifactIconProps {
  type: ArtifactType;
  size?: number;
  className?: string;
}

export const ArtifactIcon: React.FC<ArtifactIconProps> = ({ 
  type, 
  size = 24,
  className = ''
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <div className={`${config.color} ${className}`}>
      <Icon size={size} />
    </div>
  );
};