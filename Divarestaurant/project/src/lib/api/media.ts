import { supabase } from '../supabase/client';

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  location: 'hero' | 'gallery' | 'shows';
  created_at: string;
}

export async function uploadMedia(file: File, location: 'hero' | 'gallery' | 'shows'): Promise<MediaItem> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `media/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('media')
      .insert({
        url: publicUrl,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: file.size,
        location: location
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}

export async function getMediaList(location?: 'hero' | 'gallery' | 'shows'): Promise<MediaItem[]> {
  let query = supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (location) {
    query = query.eq('location', location);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function deleteMedia(id: string): Promise<void> {
  const { data: mediaItem } = await supabase
    .from('media')
    .select('url')
    .eq('id', id)
    .single();

  if (mediaItem) {
    const filePath = mediaItem.url.split('/').pop();
    await supabase.storage.from('media').remove([`media/${filePath}`]);
  }

  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateMediaLocation(id: string, location: 'hero' | 'gallery' | 'shows'): Promise<void> {
  const { error } = await supabase
    .from('media')
    .update({ location })
    .eq('id', id);

  if (error) throw error;
}