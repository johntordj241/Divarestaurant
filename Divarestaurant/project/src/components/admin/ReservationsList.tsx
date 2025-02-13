import React from 'react';
import { useReservations } from '../../hooks/useReservations';
import { formatDate } from '../../utils/date';

export function ReservationsList() {
  const { reservations, isLoading } = useReservations();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-serif mb-4">Réservations à venir</h2>
      
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id}
            className="border-b pb-4 last:border-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{reservation.customerName}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(reservation.date)} - {reservation.time}
                </p>
                <p className="text-sm text-gray-600">
                  {reservation.numberOfGuests} personnes
                </p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm ${
                reservation.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}