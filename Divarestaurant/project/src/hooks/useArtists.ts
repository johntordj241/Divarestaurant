import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
  specialties: string[];
  nextShow?: {
    date: string;
    time: string;
  };
}

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const { data, error } = await supabase
          .from('artists')
          .select(`
            *,
            next_show:shows(
              date,
              time
            )
          `)
          .order('name');

        if (error) throw error;
        setArtists(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch artists'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtists();
  }, []);

  return { artists, isLoading, error };
}