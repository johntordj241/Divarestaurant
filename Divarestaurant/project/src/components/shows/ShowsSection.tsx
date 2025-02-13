import React from 'react';
import { useShows } from '../../hooks/useShows';
import { ShowCard } from './ShowCard';

export function ShowsSection() {
  const { shows, isLoading, error } = useShows();

  const handleBookShow = (showId: string) => {
    // TODO: Implement booking logic
    console.log('Booking show:', showId);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des spectacles...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des spectacles.
      </div>
    );
  }

  return (
    <section id="shows" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-center mb-12">
          Nos Prochains Spectacles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onBook={handleBookShow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}