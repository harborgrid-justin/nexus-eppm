
import { useState, useCallback } from 'react';
import { generatePortfolioReport } from '../services/geminiService';
import { Project } from '../types';

export const useGeminiAnalysis = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (projects: Project[]) => {
    setIsGenerating(true);
    setReport(null);
    setError(null);
    
    try {
      const result = await generatePortfolioReport(projects);
      setReport(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  return {
    generateReport,
    report,
    isGenerating,
    error,
    reset
  };
};
