import { BasePlugin } from '../BasePlugin';
import { SpreadsheetArtifact } from './SpreadsheetArtifact';
import { ValidationRule } from '../../artifacts/ArtifactValidator';
import { ArtifactType } from '../../../types/artifacts';

export class SpreadsheetPlugin extends BasePlugin {
  metadata = {
    id: 'core.spreadsheet',
    name: 'Spreadsheet Plugin',
    version: '1.0.0',
    description: 'Core plugin for spreadsheet artifacts',
    author: 'System'
  };

  artifactType: ArtifactType = 'spreadsheet';
  
  // Enable batch processing for spreadsheets
  supportsBatchProcessing = true;

  createArtifact(): SpreadsheetArtifact {
    return new SpreadsheetArtifact();
  }

  getValidationRules(): ValidationRule[] {
    return [
      (data: any) => {
        this.validateRequiredArray(data.columns, 'columns');
        this.validateRequiredArray(data.rows, 'rows');

        const columnCount = data.columns.length;
        data.rows.forEach((row: any[], index: number) => {
          if (!Array.isArray(row)) {
            throw new Error(`Row ${index} must be an array`);
          }
          if (row.length !== columnCount) {
            throw new Error(`Row ${index} has incorrect number of columns`);
          }
        });

        if (data.style?.columnStyles) {
          Object.entries(data.style.columnStyles).forEach(([column, style]: [string, any]) => {
            if (!data.columns.includes(column)) {
              throw new Error(`Style defined for non-existent column: ${column}`);
            }
            if (style.align && !['left', 'center', 'right'].includes(style.align)) {
              throw new Error(`Invalid alignment for column ${column}`);
            }
          });
        }
      }
    ];
  }

  getTemplateSchema(): object {
    return {
      type: 'object',
      properties: {
        columns: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1
        },
        style: {
          type: 'object',
          properties: {
            columnStyles: {
              type: 'object',
              patternProperties: {
                '.*': {
                  type: 'object',
                  properties: {
                    align: {
                      type: 'string',
                      enum: ['left', 'center', 'right']
                    },
                    width: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      required: ['columns']
    };
  }

  getBatchProcessingConfig(): object {
    return {
      operations: ['filter', 'sort', 'aggregate', 'transform'],
      inputFormats: ['csv', 'tsv', 'xlsx'],
      outputFormats: ['csv', 'tsv', 'xlsx']
    };
  }

  getExportFormats(): string[] {
    return ['csv', 'tsv', 'xlsx', 'json'];
  }
}