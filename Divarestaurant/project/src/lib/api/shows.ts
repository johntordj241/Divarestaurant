import { supabase } from '../supabase/client';
import { Show } from '../../types';

export async function getShows(): Promise<Show[]> {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date');
    
  if (error) throw error;
  return data;
}