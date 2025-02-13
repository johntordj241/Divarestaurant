import React from 'react';
import { Calendar, Star, Users, Clock } from 'lucide-react';
import { SpecialEvent } from '../../types/events';

interface SpecialEventCardProps {
  event: SpecialEvent;
  onBook: (eventId: string) => void;
}

export function SpecialEventCard({ event, onBook }: SpecialEventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {event.isVIP && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-black rounded-full text-sm font-medium">
            VIP
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-serif mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>
              {event.minimumPartySize 
                ? `Minimum ${event.minimumPartySize} personnes`
                : `Capacité: ${event.capacity} places`}
            </span>
          </div>
          {event.dresscode && (
            <div className="flex items-center gap-2 text-gray-600">
              <Star size={18} />
              <span>Dress code: {event.dresscode}</span>
            </div>
          )}
        </div>

        {event.benefits && event.benefits.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Inclus :</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {event.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-2xl font-serif">{event.price}€</span>
          <button
            onClick={() => onBook(event.id)}
            className="px-6 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}