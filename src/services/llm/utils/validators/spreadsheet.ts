import { SpreadsheetArtifact } from '../../../../types/artifacts';

export function validateSpreadsheetArtifact(data: SpreadsheetArtifact): void {
  if (!Array.isArray(data.columns) || data.columns.length === 0) {
    throw new Error('Spreadsheet must have at least one column');
  }
  if (!Array.isArray(data.rows)) {
    throw new Error('Spreadsheet rows must be an array');
  }
  
  const columnCount = data.columns.length;
  data.rows.forEach((row, index) => {
    if (!Array.isArray(row)) {
      throw new Error(`Row ${index} must be an array`);
    }
    if (row.length !== columnCount) {
      throw new Error(`Row ${index} has ${row.length} columns, expected ${columnCount}`);
    }
  });
}