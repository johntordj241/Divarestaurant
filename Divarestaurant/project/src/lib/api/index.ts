import { supabase } from '../supabase/client';
import { Database } from '../../types/supabase';

export async function createReservation(data: Database['public']['Tables']['reservations']['Insert']) {
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return reservation;
}

export async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:menu_categories(*)
    `)
    .eq('available', true)
    .order('name');

  if (error) throw error;
  return data;
}

export async function uploadMedia(file: File, path: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
}