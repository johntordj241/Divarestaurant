import React from 'react';
import { Leaf, Wheat } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/price';

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function MenuItemCard({ item, isSelected, onSelect }: MenuItemCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        relative overflow-hidden rounded-lg shadow-md transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-gold' : 'hover:shadow-lg'}
      `}
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif">{item.name}</h3>
          <div className="flex gap-2">
            {item.is_vegetarian && (
              <Leaf size={20} className="text-green-500" />
            )}
            {item.is_gluten_free && (
              <Wheat size={20} className="text-amber-500" />
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-serif">{formatPrice(item.price)}</span>
          {item.allergens && item.allergens.length > 0 && (
            <span className="text-xs text-gray-500">
              Allergènes: {item.allergens.join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}