import React, { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { MenuItem } from '../../types';
import { MenuFilters } from './MenuFilters';
import { MenuGrid } from './MenuGrid';

interface MenuSectionProps {
  onMenuSelect: (items: MenuItem[]) => void;
  selectedItems: MenuItem[];
}

export function MenuSection({ onMenuSelect, selectedItems }: MenuSectionProps) {
  const [filters, setFilters] = useState({
    categoryId: undefined,
    isVegetarian: false,
    isGlutenFree: false,
  });

  const { items, categories, isLoading, error } = useMenu(filters);

  const handleItemSelect = (item: MenuItem) => {
    const newSelection = selectedItems.some((selected) => selected.id === item.id)
      ? selectedItems.filter((selected) => selected.id !== item.id)
      : [...selectedItems, item];
    onMenuSelect(newSelection);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement du menu...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement du menu.
      </div>
    );
  }

  return (
    <div>
      <MenuFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />
      <MenuGrid
        items={items}
        onSelect={handleItemSelect}
        selectedItems={selectedItems}
      />
    </div>
  );
}