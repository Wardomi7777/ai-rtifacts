import React from 'react';
import { FileText, Table, GitBranch, FormInput, Search, Layout, Image, Mic, ListTodo, Code } from 'lucide-react';
import { ArtifactData } from '../../types/artifacts';
import { typeConfig } from '../../config/artifactTypes';

interface ArtifactItemProps {
  artifact: ArtifactData;
  onClick: () => void;
}

export const ArtifactItem: React.FC<ArtifactItemProps> = ({ artifact, onClick }) => {
  const config = typeConfig[artifact.type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
    >
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">
          {artifact.title || artifact.type}
        </div>
        {artifact.description && (
          <div className="text-sm text-gray-500 truncate">
            {artifact.description}
          </div>
        )}
      </div>
    </button>
  );
};