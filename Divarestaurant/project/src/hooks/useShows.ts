import { useState, useEffect } from 'react';
import { Show } from '../types';
import { getShows } from '../lib/api/shows';

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadShows() {
      try {
        setIsLoading(true);
        const data = await getShows();
        setShows(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load shows'));
      } finally {
        setIsLoading(false);
      }
    }

    loadShows();
  }, []);

  return { shows, isLoading, error };
}