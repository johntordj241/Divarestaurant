import { useState, useCallback } from 'react';
import { ValidationReport } from '../types/validation';
import { runQualityCheck } from '../utils/validation';

export function useQualityCheck() {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newReport = await runQualityCheck();
      setReport(newReport);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to run quality check'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    report,
    isLoading,
    error,
    refresh
  };
}