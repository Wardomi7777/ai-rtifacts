import React, { useCallback } from 'react';
import { CellSelection } from './types';
import { AddRowButton } from './AddRowButton';

interface SpreadsheetBodyProps {
  columns: string[];
  rows: string[][];
  selectedCells: CellSelection;
  onCellSelect: (rowIndex: number, columnIndex: number) => void;
  onCellRangeSelect: (rowIndex: number, columnIndex: number) => void;
  onAddRow: (newData: { columns: string[]; rows: string[][] }) => void;
  columnStyles?: Record<string, any>;
}

export const SpreadsheetBody: React.FC<SpreadsheetBodyProps> = ({
  columns,
  rows,
  selectedCells,
  onCellSelect,
  onCellRangeSelect,
  onAddRow,
  columnStyles,
}) => {
  const isCellSelected = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (!selectedCells) return false;
      const { startRow, startCol, endRow, endCol } = selectedCells;
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      
      return (
        rowIndex >= minRow &&
        rowIndex <= maxRow &&
        columnIndex >= minCol &&
        columnIndex <= maxCol
      );
    },
    [selectedCells]
  );

  const handleMouseDown = (rowIndex: number, columnIndex: number) => {
    onCellSelect(rowIndex, columnIndex);
  };

  const handleMouseEnter = (rowIndex: number, columnIndex: number, e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left mouse button is pressed
      onCellRangeSelect(rowIndex, columnIndex);
    }
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200 relative">
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-50">
          {row.map((cell, columnIndex) => {
            const style = columnStyles?.[columns[columnIndex]] || {};
            return (
              <td
                key={`${rowIndex}-${columnIndex}`}
                className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isCellSelected(rowIndex, columnIndex)
                    ? 'bg-blue-100'
                    : ''
                }`}
                onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
                onMouseEnter={(e) => handleMouseEnter(rowIndex, columnIndex, e)}
                style={{
                  textAlign: style.align || 'left',
                  userSelect: 'none',
                }}
              >
                {cell}
              </td>
            );
          })}
          <td className="w-12 p-0 border-l border-gray-200"></td>
        </tr>
      ))}
      <tr>
        <td colSpan={columns.length} className="p-0 border-t border-gray-200">
          <AddRowButton
            columns={columns}
            rows={rows}
            onAddRow={onAddRow}
            className="w-full py-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
          />
        </td>
        <td className="w-12 p-0 border-l border-t border-gray-200"></td>
      </tr>
    </tbody>
  );
};