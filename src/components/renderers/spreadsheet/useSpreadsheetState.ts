import { useState, useCallback, useMemo } from 'react';
import { SortConfig, CellSelection } from './types';

export const useSpreadsheetState = (initialData: string[][]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    columnIndex: -1,
    direction: 'asc',
  });

  const [selectedCells, setSelectedCells] = useState<CellSelection | null>(null);

  const handleSort = useCallback((columnIndex: number) => {
    setSortConfig((currentConfig) => ({
      columnIndex,
      direction:
        currentConfig.columnIndex === columnIndex && currentConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  }, []);

  const handleCellSelect = useCallback((rowIndex: number, columnIndex: number) => {
    setSelectedCells({
      startRow: rowIndex,
      startCol: columnIndex,
      endRow: rowIndex,
      endCol: columnIndex,
    });
  }, []);

  const handleCellRangeSelect = useCallback((rowIndex: number, columnIndex: number) => {
    setSelectedCells((current) => {
      if (!current) return null;
      return {
        ...current,
        endRow: rowIndex,
        endCol: columnIndex,
      };
    });
  }, []);

  const getSortedData = useCallback(() => {
    if (sortConfig.columnIndex === -1) return initialData;

    return [...initialData].sort((a, b) => {
      const aValue = a[sortConfig.columnIndex];
      const bValue = b[sortConfig.columnIndex];

      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }, [initialData, sortConfig]);

  return {
    sortConfig,
    handleSort,
    selectedCells,
    handleCellSelect,
    handleCellRangeSelect,
    getSortedData,
  };
};