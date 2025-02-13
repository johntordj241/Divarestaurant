import React from 'react';
import { Clock, Users, UtensilsCrossed, MessageSquare } from 'lucide-react';
import { Reservation } from '../../types';
import { formatDate } from '../../utils/date';

interface ReservationDetailsProps {
  reservation: Reservation;
  onStatusChange: (status: 'confirmed' | 'cancelled') => void;
}

export function ReservationDetails({ reservation, onStatusChange }: ReservationDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-serif">Détails de la réservation</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange('confirmed')}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Confirmer
          </button>
          <button
            onClick={() => onStatusChange('cancelled')}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Date et heure</p>
              <p className="font-medium">
                {formatDate(reservation.date)} - {reservation.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Invités</p>
              <p className="font-medium">{reservation.numberOfGuests} personnes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UtensilsCrossed className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Menus sélectionnés</p>
              <ul className="list-disc list-inside">
                {reservation.selectedMenuIds.map((menuId) => (
                  <li key={menuId} className="font-medium">Menu {menuId}</li>
                ))}
              </ul>
            </div>
          </div>

          {reservation.specialRequests && (
            <div className="flex items-start gap-3">
              <MessageSquare className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Demandes spéciales</p>
                <p className="font-medium">{reservation.specialRequests}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Informations client</h4>
          <p>
            <span className="text-gray-600">Nom:</span>{' '}
            {reservation.customerName}
          </p>
          <p>
            <span className="text-gray-600">Email:</span>{' '}
            {reservation.customerEmail}
          </p>
          <p>
            <span className="text-gray-600">Téléphone:</span>{' '}
            {reservation.customerPhone}
          </p>
        </div>
      </div>
    </div>
  );
}