import { useState, useEffect } from 'react';
import { Version } from '../types/changelog';
import { supabase } from '../lib/supabase/client';

export function useChangelog() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchVersions() {
      try {
        const { data, error: supabaseError } = await supabase
          .from('versions')
          .select('*')
          .order('date', { ascending: false });

        if (supabaseError) throw supabaseError;
        
        const formattedVersions = data.map(version => ({
          ...version,
          sections: Array.isArray(version.sections) ? version.sections : JSON.parse(version.sections)
        }));
        
        setVersions(formattedVersions);
        if (formattedVersions.length > 0) {
          setCurrentVersion(formattedVersions[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch versions'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchVersions();
  }, []);

  return {
    versions,
    currentVersion,
    setCurrentVersion,
    isLoading,
    error
  };
}