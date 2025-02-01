import { useState } from 'react';
import { LLMAPIClient } from '../services/llm/api/client';

export const useFileProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const content = await readFile(file);
      const llmClient = new LLMAPIClient();
      
      // Process the content with LLM to get a clean, formatted version
      const response = await llmClient.complete({
        messages: [
          {
            role: 'system',
            content: `You are a file content processor. Extract and format the main content from the provided file.
Format the content in a clear, structured way that preserves the original meaning and organization.
Focus on the actual content, removing any unnecessary formatting or metadata.

For spreadsheets/CSV:
- Convert to a markdown table format
- Preserve column headers
- Keep data aligned and organized

For documents:
- Maintain heading structure
- Preserve lists and tables
- Keep important formatting (bold, italic, etc.)
- Remove unnecessary whitespace

Return ONLY the processed content, no explanations or metadata.`
          },
          {
            role: 'user',
            content: `File name: ${file.name}\nContent:\n${content}`
          }
        ],
        model: 'gpt-4o'
      });

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    processFile,
    loading,
    error
  };
};

async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    if (file.type === 'application/pdf') {
      // For PDFs, we'd need a PDF parsing library
      // Since we can't install additional packages, we'll return an error
      reject(new Error('PDF processing is not supported in this environment'));
    } else if (file.type.includes('spreadsheet') || file.name.endsWith('.csv')) {
      reader.readAsText(file); // For CSV/spreadsheets
    } else {
      reader.readAsText(file); // For text files
    }
  });
}