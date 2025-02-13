import React from 'react';
import { MenuItem } from '../../types';
import { Leaf } from 'lucide-react';

interface MenuCardProps {
  menu: MenuItem;
  isSelected: boolean;
  onSelect: (menuId: string) => void;
}

export function MenuCard({ menu, isSelected, onSelect }: MenuCardProps) {
  return (
    <div
      onClick={() => onSelect(menu.id)}
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-gold bg-gold/5'
          : 'border-gray-200 hover:border-gold/50'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-serif">{menu.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{menu.description}</p>
        </div>
        {menu.isVegetarian && (
          <Leaf className="text-green-500" size={20} />
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-2xl font-serif">{menu.price}€</p>
      </div>
      
      {menu.allergens && menu.allergens.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Allergènes: {menu.allergens.join(', ')}
        </p>
      )}
    </div>
  );
}