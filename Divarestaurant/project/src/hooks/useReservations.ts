import { useState, useEffect } from 'react';
import { Reservation } from '../types';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data pour le moment
    const mockReservations: Reservation[] = [
      {
        id: '1',
        showTimeId: '123',
        numberOfGuests: 4,
        selectedMenuIds: ['menu-1'],
        totalPrice: 340,
        customerName: 'Jean Dupont',
        customerEmail: 'jean@example.com',
        customerPhone: '+33612345678',
        status: 'confirmed'
      },
      {
        id: '2',
        showTimeId: '124',
        numberOfGuests: 2,
        selectedMenuIds: ['menu-2'],
        totalPrice: 170,
        customerName: 'Marie Martin',
        customerEmail: 'marie@example.com',
        customerPhone: '+33687654321',
        status: 'pending'
      }
    ];

    setReservations(mockReservations);
    setIsLoading(false);
  }, []);

  return { reservations, isLoading };
}