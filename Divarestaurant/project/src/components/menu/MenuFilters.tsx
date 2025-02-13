import React from 'react';
import { Filter } from 'lucide-react';

interface MenuFiltersProps {
  filters: {
    categoryId?: string;
    isVegetarian: boolean;
    isGlutenFree: boolean;
  };
  categories: Array<{ id: string; name: string }>;
  onChange: (filters: MenuFiltersProps['filters']) => void;
}

export function MenuFilters({ filters, categories, onChange }: MenuFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-gray-500" />
        <select
          value={filters.categoryId || ''}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value || undefined })}
          className="border rounded-md px-3 py-1.5"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.isVegetarian}
          onChange={(e) => onChange({ ...filters, isVegetarian: e.target.checked })}
          className="rounded border-gray-300 text-gold focus:ring-gold"
        />
        <span>Végétarien</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.isGlutenFree}
          onChange={(e) => onChange({ ...filters, isGlutenFree: e.target.checked })}
          className="rounded border-gray-300 text-gold focus:ring-gold"
        />
        <span>Sans gluten</span>
      </label>
    </div>
  );
}