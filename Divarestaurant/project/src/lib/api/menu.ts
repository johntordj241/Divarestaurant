import { supabase } from '../supabase/client';
import { MenuItem, MenuCategory } from '../../types';

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data;
}

export async function getMenuItems(filters?: {
  categoryId?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
}): Promise<MenuItem[]> {
  let query = supabase
    .from('menu_items')
    .select('*, category:menu_categories(name)')
    .eq('available', true);
    
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.isVegetarian) {
    query = query.eq('is_vegetarian', true);
  }
  if (filters?.isGlutenFree) {
    query = query.eq('is_gluten_free', true);
  }
  
  const { data, error } = await query.order('name');
  if (error) throw error;
  return data;
}