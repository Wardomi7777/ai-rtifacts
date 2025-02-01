import { useState } from 'react';
import { LLMAPIClient } from '../services/llm/api/client';
import { SpreadsheetArtifact } from '../types/artifacts';

export const useSpreadsheetRow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRow = async (
    rowData: Record<string, string>,
    currentColumns: string[],
    currentRows: string[][]
  ): Promise<SpreadsheetArtifact | null> => {
    setLoading(true);
    setError(null);

    try {
      const llmClient = new LLMAPIClient();
      
      const response = await llmClient.complete({
        messages: [
          {
            role: 'system',
            content: `You are a spreadsheet data generator. Given a spreadsheet structure and partial row data, generate missing values for the new row based on the existing data and context.

Your response must be a valid JSON object with this structure:
{
  "type": "spreadsheet",
  "columns": ["string"],
  "rows": [["string"]],
  "metadata": {
    "lastUpdated": "ISO date string"
  }
}

CRITICAL RULES:
1. Keep all existing columns and rows
2. Add the new row with provided and generated values
3. Generate contextually appropriate values for missing fields
4. Maintain data consistency with existing rows
5. Return complete spreadsheet object
6. Use proper JSON format`
          },
          {
            role: 'user',
            content: `Current spreadsheet:
Columns: ${JSON.stringify(currentColumns)}
Rows: ${JSON.stringify(currentRows)}

New row partial data: ${JSON.stringify(rowData)}`
          }
        ],
        model: 'gpt-4o'
      });

      const result = JSON.parse(response);
      
      if (result.type !== 'spreadsheet' || !Array.isArray(result.columns) || !Array.isArray(result.rows)) {
        throw new Error('Invalid response format from API');
      }

      // Validate the response
      if (result.rows.length !== currentRows.length + 1) {
        throw new Error('Generated data has incorrect number of rows');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate row';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateRow,
    loading,
    error
  };
};