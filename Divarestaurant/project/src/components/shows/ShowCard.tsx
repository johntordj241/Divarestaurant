import React from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import { Show } from '../../types';
import { formatDate } from '../../utils/date';

interface ShowCardProps {
  show: Show;
  onBook: (showId: string) => void;
}

export function ShowCard({ show, onBook }: ShowCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={show.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80"}
        alt={show.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80";
        }}
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-serif mb-2">{show.title}</h3>
            <p className="text-gray-600">{show.description}</p>
          </div>
          {show.isSpecialEvent && (
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm">
              Événement Spécial
            </span>
          )}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>{formatDate(show.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span>{show.time}</span>
          </div>
          {show.artist && (
            <div className="flex items-center gap-2 text-gray-600">
              <Star size={18} />
              <span>{show.artist}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onBook(show.id)}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
        >
          Réserver
        </button>
      </div>
    </div>
  );
}