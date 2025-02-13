import React from 'react';
import { Star, Calendar } from 'lucide-react';

interface ArtistProps {
  name: string;
  image: string;
  bio: string;
  nextShow?: {
    date: string;
    time: string;
  };
  specialties: string[];
}

export function ArtistCard({ name, image, bio, nextShow, specialties }: ArtistProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        <img
          src={image || "https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80"}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-2xl font-serif text-white">{name}</h3>
      </div>
      
      <div className="p-6 space-y-4">
        <p className="text-gray-600">{bio}</p>
        
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <span 
              key={specialty}
              className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
        
        {nextShow && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>Prochain show: {nextShow.date} à {nextShow.time}</span>
          </div>
        )}
      </div>
    </div>
  );
}