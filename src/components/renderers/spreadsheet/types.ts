export interface SortConfig {
  columnIndex: number;
  direction: 'asc' | 'desc';
}

export interface CellSelection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}