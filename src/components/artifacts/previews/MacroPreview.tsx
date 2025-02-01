import React from 'react';
import { MacroArtifact } from '../../../types/artifacts';
import { typeConfig } from '../../../config/artifactTypes';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface MacroPreviewProps {
  artifact: MacroArtifact;
}

export const MacroPreview: React.FC<MacroPreviewProps> = ({ artifact }) => {
  return (
    <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
      <div className="flex-1 p-4 overflow-hidden">
        <div className="space-y-3">
          {artifact.steps.slice(0, 4).map((step, index) => {
            const config = typeConfig[step.type];
            const Icon = config.icon;
            
            return (
              <div key={index} className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${config.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {step.prompt}
                  </p>
                  {step.addToKnowledge && (
                    <span className="text-xs text-purple-600">Adds to Knowledge</span>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : artifact.currentStep === index && artifact.status === 'running' ? (
                    <Clock size={16} className="text-purple-500 animate-spin" />
                  ) : step.error ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : null}
                </div>
              </div>
            );
          })}
          {artifact.steps.length > 4 && (
            <div className="text-sm text-gray-500 text-center">
              +{artifact.steps.length - 4} more steps
            </div>
          )}
        </div>
      </div>
    </div>
  );
};