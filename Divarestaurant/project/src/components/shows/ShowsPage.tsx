import React from 'react';
import { Calendar } from 'lucide-react';
import { ShowsSection } from './ShowsSection';

export function ShowsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">NOS SPECTACLES</h1>
        
        <div className="text-center mb-12">
          <p className="text-xl text-deep-red mb-4">Une expérience unique chaque soir</p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Découvrez notre programmation exceptionnelle d'artistes et de performances
            qui font de chaque soirée un moment inoubliable.
          </p>
        </div>

        <ShowsSection />
      </div>
    </div>
  );
}