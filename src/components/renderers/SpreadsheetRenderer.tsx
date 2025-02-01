import React, { useMemo } from 'react';
import { SpreadsheetHeader } from './spreadsheet/SpreadsheetHeader';
import { SpreadsheetBody } from './spreadsheet/SpreadsheetBody';
import { SpreadsheetMetadata } from './spreadsheet/SpreadsheetMetadata';
import { SpreadsheetAIEdit } from './spreadsheet/SpreadsheetAIEdit';
import { SpreadsheetBatch } from './spreadsheet/SpreadsheetBatch';
import { AddRowButton } from './spreadsheet/AddRowButton';
import { AddColumnButton } from './spreadsheet/AddColumnButton';
import { SpreadsheetAnalysis } from './spreadsheet/SpreadsheetAnalysis';
import { useSpreadsheetState } from './spreadsheet/useSpreadsheetState';
import { useArtifactStore } from '../../store/useArtifactStore';
import { SpreadsheetArtifact } from '../../types/artifacts';

interface SpreadsheetRendererProps {
  data: SpreadsheetArtifact;
}

export const SpreadsheetRenderer: React.FC<SpreadsheetRendererProps> = ({ data }) => {
  const { updateArtifact } = useArtifactStore();
  const {
    sortConfig,
    handleSort,
    selectedCells,
    handleCellSelect,
    handleCellRangeSelect,
    getSortedData,
  } = useSpreadsheetState(data.rows);

  const sortedData = useMemo(() => getSortedData(), [data.rows, sortConfig]);

  return (
    <div className="space-y-4">
      {/* Metadata section */}
      <SpreadsheetMetadata
        title={data.metadata?.title}
        description={data.metadata?.description}
        lastUpdated={data.metadata?.lastUpdated}
      />

      {/* Main spreadsheet container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <SpreadsheetHeader
              columns={data.columns}
              rows={data.rows}
              sortConfig={sortConfig}
              onSort={handleSort}
              columnStyles={data.style?.columnStyles}
              onAddColumn={(newData) => updateArtifact({ ...data, ...newData })}
            />
            <SpreadsheetBody
              columns={data.columns}
              rows={sortedData}
              selectedCells={selectedCells}
              onCellSelect={handleCellSelect}
              onCellRangeSelect={handleCellRangeSelect}
              columnStyles={data.style?.columnStyles}
              onAddRow={(newData) => updateArtifact({ ...data, ...newData })}
            />
          </table>
        </div>
      </div>

      {/* AI Edit */}
      <SpreadsheetAIEdit
        data={data}
        onUpdate={updateArtifact}
      />

      {/* Batch Processing */}
      <SpreadsheetBatch
        columns={data.columns}
        rows={data.rows}
      />

      {/* Analysis section */}
      <SpreadsheetAnalysis data={data} />
    </div>
  );
};