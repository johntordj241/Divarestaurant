import { supabase } from '../supabase/client';
import { NotificationService } from '../notifications/NotificationService';
import { ReservationStatus } from '../../types/reservation';

const notificationService = NotificationService.getInstance();

async function checkAvailability(date: string, time: string, numberOfGuests: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('reservations')
    .select('number_of_guests')
    .eq('date', date)
    .eq('time', time)
    .eq('status', 'confirmed');

  if (error) throw error;

  const totalGuests = data?.reduce((sum, res) => sum + res.number_of_guests, 0) || 0;
  const maxCapacity = 100; // Capacité maximale du restaurant

  return (totalGuests + numberOfGuests) <= maxCapacity;
}

export async function createReservation(data: {
  date: string;
  time: string;
  numberOfGuests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  menuIds: string[];
  tableId?: string;
  specialRequests?: string;
}) {
  try {
    // Vérifier la disponibilité
    const isAvailable = await checkAvailability(data.date, data.time, data.numberOfGuests);
    if (!isAvailable) {
      throw new Error('Cette plage horaire n\'est plus disponible');
    }

    // Vérifier la disponibilité de la table si spécifiée
    if (data.tableId) {
      const isTableAvailable = await checkTableAvailability(data.tableId, data.date, data.time);
      if (!isTableAvailable) {
        throw new Error('Cette table n\'est plus disponible');
      }
    }

    // Créer la réservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        ...data,
        status: 'pending',
        payment_status: 'pending',
        modification_history: [{
          timestamp: new Date().toISOString(),
          action: 'created',
          details: 'Réservation créée'
        }]
      })
      .select()
      .single();

    if (error) throw error;

    // Envoyer les notifications
    await Promise.all([
      notificationService.sendEmail(
        data.customerEmail,
        'reservation_confirmation',
        {
          name: data.customerName,
          date: data.date,
          time: data.time,
          guests: data.numberOfGuests,
          reservationId: reservation.id
        }
      ),
      notificationService.sendSMS(
        data.customerPhone,
        'reservation_confirmation',
        {
          name: data.customerName,
          date: data.date,
          time: data.time
        }
      )
    ]);

    return reservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservationStatus(
  reservationId: string,
  status: ReservationStatus,
  note?: string
) {
  try {
    const { data: currentReservation } = await supabase
      .from('reservations')
      .select('modification_history, customer_email, customer_name, date, time')
      .eq('id', reservationId)
      .single();

    const newHistory = [
      ...(currentReservation?.modification_history || []),
      {
        timestamp: new Date().toISOString(),
        action: `status_changed_to_${status}`,
        note: note,
        details: `Statut changé en ${status}`
      }
    ];

    const { data: reservation, error } = await supabase
      .from('reservations')
      .update({ 
        status,
        modification_history: newHistory,
        last_modified: new Date().toISOString()
      })
      .eq('id', reservationId)
      .select()
      .single();

    if (error) throw error;

    // Envoyer les notifications appropriées
    if (currentReservation) {
      await sendStatusNotifications(currentReservation, status);
    }

    return reservation;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
}

export async function getReservationDetails(reservationId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      table:tables(*),
      menus:menu_items(*)
    `)
    .eq('id', reservationId)
    .single();

  if (error) throw error;
  return data;
}

export async function getReservationsByDate(date: string, filters?: {
  status?: ReservationStatus;
  minGuests?: number;
  maxGuests?: number;
}) {
  let query = supabase
    .from('reservations')
    .select(`
      *,
      table:tables(*)
    `)
    .eq('date', date)
    .order('time');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.minGuests) {
    query = query.gte('numberOfGuests', filters.minGuests);
  }
  if (filters?.maxGuests) {
    query = query.lte('numberOfGuests', filters.maxGuests);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addReservationNote(reservationId: string, note: string) {
  const { data: currentReservation } = await supabase
    .from('reservations')
    .select('notes')
    .eq('id', reservationId)
    .single();

  const newNotes = [
    ...(currentReservation?.notes || []),
    {
      timestamp: new Date().toISOString(),
      content: note
    }
  ];

  const { data, error } = await supabase
    .from('reservations')
    .update({ notes: newNotes })
    .eq('id', reservationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function exportReservations(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      table:tables(*),
      menus:menu_items(*)
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');

  if (error) throw error;
  return data;
}

// Fonctions privées
async function checkTableAvailability(tableId: string, date: string, time: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select('id')
    .eq('tableId', tableId)
    .eq('date', date)
    .eq('time', time)
    .eq('status', 'confirmed')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !data;
}

async function sendStatusNotifications(reservation: any, status: ReservationStatus) {
  const notifications = [];

  if (status === 'confirmed') {
    notifications.push(
      notificationService.sendEmail(
        reservation.customer_email,
        'reservation_confirmed',
        {
          name: reservation.customer_name,
          date: reservation.date,
          time: reservation.time
        }
      )
    );
  } else if (status === 'cancelled') {
    notifications.push(
      notificationService.sendEmail(
        reservation.customer_email,
        'reservation_cancelled',
        {
          name: reservation.customer_name,
          date: reservation.date,
          time: reservation.time
        }
      )
    );
  }

  await Promise.all(notifications);
}