import React, { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { ReservationForm } from '../ReservationForm';
import { UnitiWidget } from './UnitiWidget';

export function BookingPage() {
  const [bookingSystem, setBookingSystem] = useState<'internal' | 'uniiti'>('internal');

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">RÉSERVATION</h1>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setBookingSystem('internal')}
            className={`px-6 py-2 border ${
              bookingSystem === 'internal' 
                ? 'border-gold text-gold' 
                : 'border-white/50 text-white/50'
            } hover:border-gold hover:text-gold transition-colors`}
          >
            RÉSERVATION STANDARD
          </button>
          <button
            onClick={() => setBookingSystem('uniiti')}
            className={`px-6 py-2 border ${
              bookingSystem === 'uniiti' 
                ? 'border-gold text-gold' 
                : 'border-white/50 text-white/50'
            } hover:border-gold hover:text-gold transition-colors`}
          >
            RÉSERVATION UNIITI
          </button>
        </div>

        {bookingSystem === 'internal' ? (
          <ReservationForm />
        ) : (
          <UnitiWidget restaurantId="votre-id-restaurant" />
        )}
      </div>
    </div>
  );
}