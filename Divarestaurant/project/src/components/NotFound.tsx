import React from 'react';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif text-gold mb-4">404</h1>
        <p className="text-2xl mb-8">Page non trouvée</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
        >
          <Home size={20} />
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}