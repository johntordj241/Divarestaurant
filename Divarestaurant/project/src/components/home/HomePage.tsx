import React from 'react';
import { Sparkles } from 'lucide-react';
import { SocialWall } from './SocialWall';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80'
];

export function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section avec carrousel d'images */}
      <div className="relative h-screen overflow-hidden">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Ambiance ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-champagne/30 to-white/20 backdrop-blur-sm" />
        
        {/* Texte superposé */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="bg-white/30 backdrop-blur-md p-12 rounded-lg shadow-xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-burgundy mb-8 text-center">
              DIVA RESTAURANT
            </h1>
            <h2 className="text-2xl md:text-4xl mb-8 font-light tracking-widest text-center text-deep-red">
              GASTRONOMIE • SPECTACLES • AMBIANCE
            </h2>
            <div className="w-32 h-[1px] bg-gold mx-auto mb-10" />
            <p className="flex items-center gap-4 text-2xl md:text-3xl italic text-burgundy text-center">
              <Sparkles className="text-gold" size={24} />
              Entrez dans l'univers glamour et festif
              <Sparkles className="text-gold" size={24} />
            </p>
          </div>
        </div>

        {/* Overlay décoratif */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/30 to-transparent" />
        </div>
      </div>

      {/* Section Sociale avec fond beige */}
      <div className="bg-champagne">
        <SocialWall />
      </div>
    </div>
  );
}