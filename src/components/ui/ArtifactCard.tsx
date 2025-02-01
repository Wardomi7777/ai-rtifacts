import React from 'react';
import { FileText, Table, GitBranch } from 'lucide-react';
import { ArtifactType } from '../../types/artifacts';

interface ArtifactCardProps {
  type: ArtifactType;
  selected: boolean;
  onClick: () => void;
}

const artifactConfig = {
  document: {
    icon: FileText,
    title: 'Document',
    description: 'Generate structured documentation with Markdown support',
    gradient: 'from-blue-500 to-cyan-400',
  },
  spreadsheet: {
    icon: Table,
    title: 'Spreadsheet',
    description: 'Create interactive tables with sortable columns',
    gradient: 'from-emerald-500 to-teal-400',
  },
  diagram: {
    icon: GitBranch,
    title: 'Diagram',
    description: 'Visualize relationships with Mermaid diagrams',
    gradient: 'from-purple-500 to-pink-400',
  },
};

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ type, selected, onClick }) => {
  const config = artifactConfig[type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`relative w-full p-6 rounded-xl transition-all duration-300 ${
        selected
          ? 'bg-gradient-to-br shadow-lg scale-105 text-white ' + config.gradient
          : 'bg-white hover:scale-102 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          selected ? 'bg-white/20' : 'bg-gradient-to-br ' + config.gradient
        }`}>
          <Icon className={selected ? 'text-white' : 'text-white'} size={24} />
        </div>
        <div className="text-left">
          <h3 className={`text-lg font-semibold ${
            selected ? 'text-white' : 'text-gray-900'
          }`}>
            {config.title}
          </h3>
          <p className={`mt-1 text-sm ${
            selected ? 'text-white/90' : 'text-gray-500'
          }`}>
            {config.description}
          </p>
        </div>
      </div>
    </button>
  );
};