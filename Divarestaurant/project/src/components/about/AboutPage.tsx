import React from 'react';
import { Wine, Star, Users } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">NOTRE HISTOIRE</h1>
        
        {/* Histoire */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <Wine className="mx-auto text-gold mb-6" size={48} />
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Le concept de Diva Restaurant Cabaret est né d'une vision claire : combler un manque à Nice en proposant un lieu festif où gastronomie, spectacle et ambiance conviviale se rencontrent. Inspiré par l'élégance du cabaret et le plaisir du partage, le concept repose sur une expérience unique, où chaque soirée devient mémorable. Au Diva, nous croyons que l'art de recevoir ne se limite pas à la célébrité, mais à l'impact que nous laissons à travers des moments exceptionnels passés ensemble. Notre mission est simple : offrir à nos clients bien plus qu'un dîner, mais une immersion dans un univers de raffinement et d'émerveillement. La phrase inscrite derrière notre carte illustre parfaitement nos valeurs : chez Diva, ce qui compte n'est pas la célébrité, mais la réputation de faire vivre des moments inoubliables.
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <Star className="mx-auto text-gold mb-4" size={32} />
            <h3 className="text-xl font-serif text-gold mb-4">Excellence</h3>
            <p className="text-gray-300">
              Une cuisine raffinée et des spectacles de haute qualité pour une expérience inoubliable.
            </p>
          </div>
          <div className="text-center">
            <Users className="mx-auto text-gold mb-4" size={32} />
            <h3 className="text-xl font-serif text-gold mb-4">Convivialité</h3>
            <p className="text-gray-300">
              Un accueil chaleureux et personnalisé pour vous faire sentir comme chez vous.
            </p>
          </div>
          <div className="text-center">
            <Wine className="mx-auto text-gold mb-4" size={32} />
            <h3 className="text-xl font-serif text-gold mb-4">Art de Vivre</h3>
            <p className="text-gray-300">
              L'alliance parfaite entre gastronomie, divertissement et élégance à la française.
            </p>
          </div>
        </div>

        {/* Équipe */}
        <div className="bg-white/5 rounded-lg p-12">
          <h2 className="text-3xl font-serif text-center text-gold mb-12">Notre Équipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Chef Michel Laurent',
                role: 'Chef Exécutif',
                image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80'
              },
              {
                name: 'Sarah Dubois',
                role: 'Directrice Artistique',
                image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80'
              },
              {
                name: 'Antoine Moreau',
                role: 'Sommelier',
                image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&q=80'
              }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-serif text-gold mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}