import React from 'react';
import { Wine, GlassWater } from 'lucide-react';

const DRINKS_MENU = [
  {
    category: 'Champagnes',
    items: [
      { name: 'Dom Pérignon', price: 390, size: '75cl' },
      { name: 'Cristal Roederer', price: 450, size: '75cl' },
      { name: 'Ruinart Blanc de Blancs', price: 180, size: '75cl' }
    ]
  },
  {
    category: 'Cocktails Signature',
    items: [
      { name: 'Diva Royal', price: 22, description: 'Champagne, liqueur de rose, fruits rouges' },
      { name: 'Golden Night', price: 24, description: 'Vodka premium, passion, vanille, feuille d\'or' },
      { name: 'Red Velvet', price: 20, description: 'Gin, framboise, citron vert, prosecco' }
    ]
  }
];

export function ClubPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">CLUB</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {DRINKS_MENU.map((section) => (
            <div key={section.category} className="space-y-6">
              <h2 className="text-2xl font-serif text-deep-red flex items-center gap-2">
                {section.category === 'Champagnes' ? <Wine className="text-deep-red" /> : <GlassWater className="text-deep-red" />}
                {section.category}
              </h2>
              
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div 
                    key={item.name}
                    className="p-4 border border-deep-red/20 rounded-lg hover:border-deep-red/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif">{item.name}</h3>
                      <span className="text-deep-red">{item.price}€</span>
                    </div>
                    {item.description && (
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    )}
                    {item.size && (
                      <p className="text-sm text-gray-500">{item.size}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}