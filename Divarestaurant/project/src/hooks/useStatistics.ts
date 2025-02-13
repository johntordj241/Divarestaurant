import { useState, useEffect } from 'react';
import { mockStatistics } from '../data/mockData';

export function useStatistics() {
  const [statistics, setStatistics] = useState(mockStatistics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simuler un chargement
    setIsLoading(true);
    setTimeout(() => {
      setStatistics(mockStatistics);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { statistics, isLoading, error };
}