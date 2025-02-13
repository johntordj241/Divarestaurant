import { supabase } from '../supabase/client';

export class UnitiService {
  private static instance: UnitiService;
  
  private constructor() {}
  
  static getInstance(): UnitiService {
    if (!UnitiService.instance) {
      UnitiService.instance = new UnitiService();
    }
    return UnitiService.instance;
  }

  async checkAvailability(date: string, time: string, guests: number): Promise<boolean> {
    try {
      // Appel à l'API Uniiti pour vérifier la disponibilité
      const response = await fetch(`${import.meta.env.VITE_UNIITI_API_URL}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_UNIITI_API_KEY}`
        },
        body: JSON.stringify({ date, time, guests })
      });

      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  async createReservation(reservationData: {
    date: string;
    time: string;
    guests: number;
    name: string;
    email: string;
    phone: string;
  }): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_UNIITI_API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_UNIITI_API_KEY}`
        },
        body: JSON.stringify(reservationData)
      });

      const data = await response.json();
      return {
        success: response.ok,
        reservationId: data.reservationId,
        error: !response.ok ? data.error : undefined
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return { success: false, error: 'Une erreur est survenue lors de la réservation.' };
    }
  }
}