import { useState, useEffect } from 'react';
import { getSystemSettings, SystemSettings } from '../lib/api/settings';

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const data = await getSystemSettings();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { settings, isLoading, error };
}