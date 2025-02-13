import { useState, useEffect } from 'react';
import { getMenuItems, getMenuCategories } from '../lib/api/menu';
import { MenuItem, MenuCategory } from '../types';

export function useMenu(filters?: {
  categoryId?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
}) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        setIsLoading(true);
        const [menuItems, menuCategories] = await Promise.all([
          getMenuItems(filters),
          getMenuCategories()
        ]);
        setItems(menuItems);
        setCategories(menuCategories);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load menu'));
      } finally {
        setIsLoading(false);
      }
    }

    loadMenu();
  }, [filters]);

  return { items, categories, isLoading, error };
}