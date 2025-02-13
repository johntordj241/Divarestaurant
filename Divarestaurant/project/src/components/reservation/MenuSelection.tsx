import React from 'react';
import { MenuItem } from '../../types';
import { UtensilsCrossed, Leaf } from 'lucide-react';

interface MenuSelectionProps {
  selectedMenus: string[];
  onMenuSelect: (menuIds: string[]) => void;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Menu Classique',
    description: 'Entrée, plat, dessert avec accord mets et vins',
    price: 85,
    isVegetarian: false,
    allergens: ['gluten', 'lactose']
  },
  {
    id: 'menu-2',
    name: 'Menu Végétarien',
    description: 'Sélection raffinée de plats végétariens',
    price: 75,
    isVegetarian: true,
    allergens: ['gluten']
  },
  {
    id: 'menu-3',
    name: 'Menu Prestige',
    description: 'Champagne, caviar et mets d\'exception',
    price: 150,
    isVegetarian: false,
    allergens: ['gluten', 'fruits de mer']
  }
];

export function MenuSelection({ selectedMenus, onMenuSelect }: MenuSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {MENU_ITEMS.map((menu) => (
          <div 
            key={menu.id}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMenus.includes(menu.id)
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'
            }`}
            onClick={() => {
              const newSelection = selectedMenus.includes(menu.id)
                ? selectedMenus.filter(id => id !== menu.id)
                : [...selectedMenus, menu.id];
              onMenuSelect(newSelection);
            }}
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
              <UtensilsCrossed 
                className={selectedMenus.includes(menu.id) ? 'text-gold' : 'text-gray-400'} 
                size={20} 
              />
            </div>
            {menu.allergens && (
              <p className="text-xs text-gray-500 mt-2">
                Allergènes: {menu.allergens.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}