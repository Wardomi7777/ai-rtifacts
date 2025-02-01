import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateArtifactPanel } from './CreateArtifactPanel';

export const CreateArtifactButton: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPanel(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>Create New</span>
      </button>

      {showPanel && <CreateArtifactPanel onClose={() => setShowPanel(false)} />}
    </>
  );
};