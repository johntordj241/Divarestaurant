import React, { useState } from 'react';
import { Wine, UtensilsCrossed, ArrowLeft, Leaf, Wheat } from 'lucide-react';

type MenuSection = 'main' | 'drinks' | 'food' | 'club';
type SubSection = 'wines' | 'cocktails' | 'soft' | 'spirits' | 'starters' | 'mains' | 'sides' | 'desserts';

export function MenuPage() {
  const [currentSection, setCurrentSection] = useState<MenuSection>('main');
  const [subSection, setSubSection] = useState<SubSection | null>(null);

  const navigateTo = (section: MenuSection, sub: SubSection | null = null) => {
    setCurrentSection(section);
    setSubSection(sub);
  };

  const renderMainMenu = () => (
    <div className="grid gap-6">
      {[
        { id: 'drinks', label: 'BOISSONS', icon: Wine },
        { id: 'food', label: 'MENU', icon: UtensilsCrossed }
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => navigateTo(item.id as MenuSection)}
          className="group relative overflow-hidden rounded-lg bg-white/5 p-8 transition-all hover:bg-white/10"
        >
          <div className="relative z-10 flex flex-col items-center gap-4">
            <item.icon className="h-12 w-12 text-gold transition-transform group-hover:scale-110" />
            <span className="text-2xl font-serif text-white">{item.label}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/50 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );

  const renderDrinksMenu = () => (
    <div className="grid gap-6">
      {[
        { id: 'wines', label: 'VINS & CHAMPAGNES', icon: Wine },
        { id: 'cocktails', label: 'LES COCKTAILS', icon: Wine }
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => navigateTo('drinks', item.id as SubSection)}
          className="group relative overflow-hidden rounded-lg bg-white/5 p-6 text-left transition-all hover:bg-white/10"
        >
          <div className="relative z-10 flex items-center gap-4">
            <item.icon className="h-8 w-8 text-gold" />
            <span className="text-xl font-serif text-white">{item.label}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderFoodMenu = () => (
    <div className="grid gap-6">
      {[
        { id: 'starters', label: 'ENTRÉES', price: '18-25€' },
        { id: 'mains', label: 'PLATS', price: '32-45€' },
        { id: 'desserts', label: 'DESSERTS', price: '14-18€' }
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => navigateTo('food', item.id as SubSection)}
          className="group relative overflow-hidden rounded-lg bg-white/5 p-6 text-left transition-all hover:bg-white/10"
        >
          <div className="flex justify-between items-center">
            <span className="text-xl font-serif text-white">{item.label}</span>
            <span className="text-gold">{item.price}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderWinesList = () => (
    <div className="space-y-8">
      {[
        {
          category: 'CHAMPAGNES',
          items: [
            { name: 'Dom Pérignon', price: 390, size: '75cl' },
            { name: 'Cristal Roederer', price: 450, size: '75cl' },
            { name: 'Ruinart Blanc de Blancs', price: 180, size: '75cl' }
          ]
        },
        {
          category: 'VINS ROUGES',
          items: [
            { name: 'Château Margaux 2015', price: 220, size: '75cl' },
            { name: 'Romanée-Conti 2018', price: 850, size: '75cl' }
          ]
        }
      ].map((section) => (
        <div key={section.category} className="bg-white/5 rounded-lg p-6">
          <h3 className="text-xl font-serif text-gold mb-6">{section.category}</h3>
          <div className="space-y-4">
            {section.items.map((wine) => (
              <div key={wine.name} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0">
                <div>
                  <h4 className="font-serif text-white">{wine.name}</h4>
                  <span className="text-sm text-gray-400">{wine.size}</span>
                </div>
                <span className="text-xl font-serif text-gold">{wine.price}€</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMainsList = () => (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-xl font-serif text-gold mb-6">PLATS PRINCIPAUX</h3>
        <div className="space-y-6">
          {[
            {
              name: 'Filet de Bœuf Rossini',
              price: 42,
              description: 'Filet de bœuf, foie gras poêlé, sauce truffe, pommes duchesse',
              tags: []
            },
            {
              name: 'Risotto aux Truffes',
              price: 36,
              description: 'Risotto carnaroli, truffe noire, parmesan 24 mois',
              tags: ['vegetarian']
            },
            {
              name: 'Loup en Croûte de Sel',
              price: 38,
              description: 'Loup de Méditerranée, légumes de saison, sauce vierge',
              tags: ['gluten-free']
            }
          ].map((dish) => (
            <div key={dish.name} className="border-b border-white/10 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-serif text-white">{dish.name}</h4>
                    {dish.tags.includes('vegetarian') && (
                      <Leaf className="text-green-500" size={16} />
                    )}
                    {dish.tags.includes('gluten-free') && (
                      <Wheat className="text-yellow-500" size={16} />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{dish.description}</p>
                </div>
                <span className="text-xl font-serif text-gold ml-4">{dish.price}€</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (currentSection === 'main') return renderMainMenu();
    if (currentSection === 'drinks' && !subSection) return renderDrinksMenu();
    if (currentSection === 'food' && !subSection) return renderFoodMenu();
    if (currentSection === 'drinks' && subSection === 'wines') return renderWinesList();
    if (currentSection === 'food' && subSection === 'mains') return renderMainsList();
    return null;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header avec logo et retour */}
        <div className="flex items-center justify-between mb-8">
          {currentSection !== 'main' && (
            <button 
              onClick={() => navigateTo('main')}
              className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Retour</span>
            </button>
          )}
          <div className="flex items-center gap-2 mx-auto">
            <Wine className="h-12 w-12 text-gold" />
            <h1 className="text-3xl font-serif text-gold">DIVA</h1>
          </div>
        </div>

        {/* Fil d'Ariane */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-serif text-white">
            {currentSection === 'main' ? 'NOTRE CARTE' :
             currentSection === 'drinks' ? 'BOISSONS' :
             currentSection === 'food' ? 'MENU' : 'CLUB'}
            {subSection && (
              <span className="text-gold">
                {' > '}{subSection.toUpperCase()}
              </span>
            )}
          </h2>
        </div>

        {/* Contenu dynamique */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}