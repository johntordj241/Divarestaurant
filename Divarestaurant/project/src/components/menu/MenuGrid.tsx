import React from 'react';
import { MenuItem } from '../../types';
import { MenuItemCard } from './MenuItemCard';

interface MenuGridProps {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  selectedItems: MenuItem[];
}

export function MenuGrid({ items, onSelect, selectedItems }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          isSelected={selectedItems.some((selected) => selected.id === item.id)}
          onSelect={() => onSelect(item)}
        />
      ))}
    </div>
  );
}