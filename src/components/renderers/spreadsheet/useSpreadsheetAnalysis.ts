import { useState } from 'react';
import { SpreadsheetArtifact } from '../../../types/artifacts';
import { generateSpreadsheetAnalysis } from '../../../services/llm/analysis/spreadsheet';

interface Analysis {
  sql: string;
  visualization?: React.ReactNode;
  explanation: string;
}

export const useSpreadsheetAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = async (question: string, data: SpreadsheetArtifact) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateSpreadsheetAnalysis(question, data);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze data');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    loading,
    error,
    analyzeData,
  };
};