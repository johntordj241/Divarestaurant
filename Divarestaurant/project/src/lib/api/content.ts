import { supabase } from '../supabase/client';

export interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'article' | 'news';
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  author: string;
  publish_date?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export async function createContent(data: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem> {
  const { data: content, error } = await supabase
    .from('content')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return content;
}

export async function updateContent(id: string, data: Partial<ContentItem>): Promise<ContentItem> {
  const { data: content, error } = await supabase
    .from('content')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return content;
}

export async function deleteContent(id: string): Promise<void> {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getContentList(type?: 'page' | 'article' | 'news', status?: 'draft' | 'published' | 'scheduled'): Promise<ContentItem[]> {
  let query = supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getContentById(id: string): Promise<ContentItem> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}