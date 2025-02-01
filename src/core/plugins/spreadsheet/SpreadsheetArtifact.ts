import { BaseArtifact } from '../../artifacts/BaseArtifact';
import { SpreadsheetArtifact as ISpreadsheetArtifact } from '../../../types/artifacts';

export class SpreadsheetArtifact extends BaseArtifact implements ISpreadsheetArtifact {
  type = 'spreadsheet' as const;
  columns: string[] = [];
  rows: string[][] = [];
  style = {
    columnStyles: {}
  };

  validate(): void {
    if (!Array.isArray(this.columns) || this.columns.length === 0) {
      throw new Error('Spreadsheet must have at least one column');
    }

    if (!Array.isArray(this.rows)) {
      throw new Error('Rows must be an array');
    }

    const columnCount = this.columns.length;
    this.rows.forEach((row, index) => {
      if (!Array.isArray(row)) {
        throw new Error(`Row ${index} must be an array`);
      }
      if (row.length !== columnCount) {
        throw new Error(`Row ${index} has incorrect number of columns`);
      }
    });
  }

  getContent(): string {
    return this.rows.map(row => row.join('\t')).join('\n');
  }

  async transform(targetType: string): Promise<any> {
    throw new Error('Transform not implemented');
  }
}