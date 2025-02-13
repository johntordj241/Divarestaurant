import { supabase } from '../supabase/client';
import { SpecialEvent, EventBooking } from '../../types/events';
import { NotificationService } from '../notifications/NotificationService';

export class EventService {
  private static instance: EventService;
  private notificationService: NotificationService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  async getUpcomingEvents(): Promise<SpecialEvent[]> {
    const { data, error } = await supabase
      .from('special_events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date');

    if (error) throw error;
    return data;
  }

  async getEventById(eventId: string): Promise<SpecialEvent> {
    const { data, error } = await supabase
      .from('special_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data;
  }

  async bookEvent(eventId: string, userId: string, numberOfGuests: number): Promise<EventBooking> {
    // Vérifier la disponibilité
    const event = await this.getEventById(eventId);
    if (numberOfGuests > event.capacity) {
      throw new Error('Capacité insuffisante');
    }

    if (event.minimumPartySize && numberOfGuests < event.minimumPartySize) {
      throw new Error(`Minimum ${event.minimumPartySize} personnes requis`);
    }

    // Créer la réservation
    const { data: booking, error } = await supabase
      .from('event_bookings')
      .insert({
        event_id: eventId,
        user_id: userId,
        number_of_guests: numberOfGuests,
        total_price: event.price * numberOfGuests,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Envoyer la notification
    await this.notificationService.sendEmail(
      booking.user_email,
      'event_booking_confirmation',
      {
        eventTitle: event.title,
        date: event.date,
        time: event.time,
        guests: numberOfGuests,
        totalPrice: booking.total_price
      }
    );

    return booking;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('event_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) throw error;
  }

  async getEventStats(eventId: string): Promise<{
    totalBookings: number;
    totalGuests: number;
    revenue: number;
  }> {
    const { data, error } = await supabase
      .from('event_bookings')
      .select('number_of_guests, total_price')
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    if (error) throw error;

    return {
      totalBookings: data.length,
      totalGuests: data.reduce((sum, booking) => sum + booking.number_of_guests, 0),
      revenue: data.reduce((sum, booking) => sum + booking.total_price, 0)
    };
  }
}