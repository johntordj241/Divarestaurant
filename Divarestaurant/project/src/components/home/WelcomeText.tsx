import React from 'react';

export function WelcomeText() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
      <div className="max-w-4xl px-6">
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
          La Diva Cabaret
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
          Découvrez une expérience unique alliant gastronomie raffinée, 
          spectacles mémorables et ambiance festive
        </p>
        <div className="w-24 h-1 bg-gold mx-auto" />
      </div>
    </div>
  );
}