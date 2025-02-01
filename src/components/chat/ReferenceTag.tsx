import React from 'react';
import { Quote } from 'lucide-react';
import { ArtifactData } from '../../types/artifacts';
import { typeConfig } from '../../config/artifactTypes';

export type ReferenceType = 'quote' | 'context' | 'knowledge' | 'template';

interface ReferenceTagProps {
  type: ReferenceType;
  title: string;
  artifactType?: ArtifactData['type'];
}

export const ReferenceTag: React.FC<ReferenceTagProps> = ({ type, title, artifactType }) => {
  const getIcon = () => {
    if (artifactType) {
      const Icon = typeConfig[artifactType].icon;
      return <Icon size={14} />;
    }
    return <Quote size={14} />;
  };

  const getColor = () => {
    switch (type) {
      case 'quote':
        return 'bg-purple-100 text-purple-700';
      case 'context':
        return 'bg-blue-100 text-blue-700';
      case 'knowledge':
        return 'bg-emerald-100 text-emerald-700';
      case 'template':
        return 'bg-indigo-100 text-indigo-700';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'quote':
        return 'Quoted';
      case 'context':
        return 'Context';
      case 'knowledge':
        return 'Knowledge';
      case 'template':
        return 'Template';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {getIcon()}
      <span>{getLabel()}:</span>
      <span className="truncate max-w-[150px]">{title}</span>
    </div>
  );
};