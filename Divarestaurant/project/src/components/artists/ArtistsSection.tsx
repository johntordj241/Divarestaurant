import React from 'react';
import { ArtistCard } from './ArtistCard';
import { useArtists } from '../../hooks/useArtists';

export function ArtistsSection() {
  const { artists, isLoading, error } = useArtists();

  if (isLoading) {
    return <div className="text-center py-8">Chargement des artistes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des artistes.
      </div>
    );
  }

  return (
    <section id="artists" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-center mb-12">
          Nos Artistes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              {...artist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}