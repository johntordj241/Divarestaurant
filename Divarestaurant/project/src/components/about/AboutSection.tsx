import React from 'react';
import { Star, MapPin } from 'lucide-react';

const locations = [
  {
    city: 'Nice',
    address: '123 Promenade des Anglais',
    phone: '+33 4 93 00 00 00'
  },
  {
    city: 'Cannes',
    address: '45 La Croisette',
    phone: '+33 4 92 00 00 00'
  }
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-6">Notre Histoire</h2>
            <p className="text-lg text-gray-300 mb-8">
              Depuis sa création, La Diva est le lieu incontournable de la Côte d'Azur, 
              mêlant spectacles de qualité, gastronomie raffinée, et une ambiance inégalée.
            </p>
            
            <div className="space-y-6">
              {locations.map((location) => (
                <div key={location.city} className="flex items-start gap-4">
                  <MapPin className="text-gold shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">{location.city}</h3>
                    <p className="text-gray-300">{location.address}</p>
                    <p className="text-gray-300">{location.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80"
              alt="Ambiance La Diva"
              className="rounded-lg w-full h-64 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80"
              alt="Spectacle La Diva"
              className="rounded-lg w-full h-64 object-cover mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}