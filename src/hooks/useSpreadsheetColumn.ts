import { useState } from 'react';
import { LLMAPIClient } from '../services/llm/api/client';
import { SpreadsheetArtifact } from '../types/artifacts';

export const useSpreadsheetColumn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateColumn = async (
    columnName: string,
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
            content: `You are a spreadsheet data generator. Given a spreadsheet structure and a new column name, generate appropriate values for the new column based on the existing data.

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
1. Keep the existing columns and add the new one
2. Keep all existing rows and add the new values
3. Generate contextually appropriate values
4. Maintain data consistency
5. Return complete spreadsheet object
6. Use proper JSON format`
          },
          {
            role: 'user',
            content: `Current spreadsheet:
Columns: ${JSON.stringify(currentColumns)}
Rows: ${JSON.stringify(currentRows)}

Generate values for new column: "${columnName}"`
          }
        ],
        model: 'gpt-4o'
      });

      const result = JSON.parse(response);
      
      if (result.type !== 'spreadsheet' || !Array.isArray(result.columns) || !Array.isArray(result.rows)) {
        throw new Error('Invalid response format from API');
      }

      // Validate the response
      if (result.rows.length !== currentRows.length) {
        throw new Error('Generated data has incorrect number of rows');
      }

      if (!result.columns.includes(columnName)) {
        throw new Error('Generated data missing new column');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate column';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateColumn,
    loading,
    error
  };
};