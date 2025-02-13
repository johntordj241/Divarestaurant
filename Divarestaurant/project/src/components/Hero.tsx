import React from 'react';

export function Hero() {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80"
        alt="La Diva Cabaret"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-6">
            La Diva Cabaret
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Une soirée inoubliable dans un cadre exceptionnel
          </p>
          <a
            href="#reservation"
            className="inline-block bg-gold px-8 py-3 text-black font-semibold rounded-full hover:bg-gold/90 transition-colors"
          >
            Réserver maintenant
          </a>
        </div>
      </div>
    </div>
  );
}