import { LLMAPIClient } from '../api/client';
import { SpreadsheetArtifact } from '../../../types/artifacts';

const ANALYSIS_SYSTEM_PROMPT = `You are a data analysis expert. Given a spreadsheet structure and a question, generate SQL-like analysis and visualization.

Your response must be a valid JSON object with this structure:
{
  "sql": "SQL query to answer the question",
  "explanation": "Clear explanation of the analysis and results",
  "visualization": {
    "type": "table" | "bar" | "line" | "pie" | "area",
    "data": {
      // For table type:
      "columns": ["Column1", "Column2", ...],
      "rows": [["Value1", "Value2", ...], ...],
      
      // For chart types:
      "xAxis": "string (column name for X axis)",
      "yAxis": "string (column name for Y axis)",
      "series": [
        {
          "name": "string (series name)",
          "data": [
            { "x": "value", "y": number },
            ...
          ]
        }
      ]
    }
  }
}

Rules:
1. Use standard SQL syntax
2. Choose appropriate visualization type based on the data and question:
   - "bar": for comparisons across categories
   - "line": for trends over time or sequences
   - "pie": for part-to-whole relationships
   - "area": for cumulative totals or stacked comparisons
   - "table": for detailed data viewing
3. Provide clear, concise explanations
4. Format numbers consistently
5. Return only valid JSON
6. Ensure visualization data matches the chosen type`;

export async function generateSpreadsheetAnalysis(question: string, data: SpreadsheetArtifact) {
  const llmClient = new LLMAPIClient();

  const context = {
    columns: data.columns,
    rowCount: data.rows.length,
    sampleData: data.rows.slice(0, 3),
    fullData: data.rows, // Include full data for accurate analysis
  };

  const response = await llmClient.complete({
    messages: [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { 
        role: 'user',
        content: JSON.stringify({
          question,
          spreadsheetContext: context,
        })
      }
    ],
  });

  try {
    const parsedResponse = JSON.parse(response);
    
    if (!parsedResponse.sql || !parsedResponse.explanation || !parsedResponse.visualization) {
      throw new Error('Invalid analysis response structure');
    }

    const validTypes = ['table', 'bar', 'line', 'pie', 'area'];
    if (!validTypes.includes(parsedResponse.visualization.type)) {
      throw new Error('Invalid visualization type');
    }

    if (parsedResponse.visualization.type === 'table') {
      if (!Array.isArray(parsedResponse.visualization.data?.columns) ||
          !Array.isArray(parsedResponse.visualization.data?.rows)) {
        throw new Error('Invalid table data structure');
      }
    } else {
      if (!parsedResponse.visualization.data?.xAxis ||
          !parsedResponse.visualization.data?.yAxis ||
          !Array.isArray(parsedResponse.visualization.data?.series)) {
        throw new Error('Invalid chart data structure');
      }
    }

    return parsedResponse;
  } catch (error) {
    throw new Error('Failed to parse analysis response: ' + (error as Error).message);
  }
}