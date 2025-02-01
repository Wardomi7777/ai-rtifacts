import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortConfig } from './types';
import { AddColumnButton } from './AddColumnButton';

interface SpreadsheetHeaderProps {
  columns: string[];
  rows: string[][];
  sortConfig: SortConfig;
  onSort: (columnIndex: number) => void;
  onAddColumn: (newData: { columns: string[]; rows: string[][] }) => void;
  columnStyles?: Record<string, any>;
}

export const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({
  columns,
  rows,
  sortConfig,
  onSort,
  onAddColumn,
  columnStyles,
}) => {
  const getSortIcon = (columnIndex: number) => {
    if (sortConfig.columnIndex !== columnIndex) return <ArrowUpDown size={16} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, index) => {
          const style = columnStyles?.[column] || {};
          return (
            <th
              key={column}
              className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort(index)}
              style={{ width: style.width }}
            >
              <div className="flex items-center gap-1">
                <span>{column}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {getSortIcon(index)}
                </span>
              </div>
            </th>
          );
        })}
        <th className="w-12 p-0">
          <AddColumnButton
            columns={columns}
            rows={rows}
            onAddColumn={onAddColumn}
            className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          />
        </th>
      </tr>
    </thead>
  );
};