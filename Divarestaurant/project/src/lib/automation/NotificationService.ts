import { supabase } from '../supabase/client';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendReservationReminder(reservation: any) {
    try {
      // Send email reminder
      await this.sendEmail({
        to: reservation.customer_email,
        template: 'reservation_reminder',
        data: {
          name: reservation.customer_name,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.number_of_guests
        }
      });

      // Send SMS if phone number is available
      if (reservation.customer_phone) {
        await this.sendSMS({
          to: reservation.customer_phone,
          template: 'reservation_reminder',
          data: {
            name: reservation.customer_name,
            time: reservation.time
          }
        });
      }

      // Log the notification
      await this.logNotification({
        type: 'reminder',
        recipient: reservation.customer_email,
        reservationId: reservation.id
      });

    } catch (error) {
      console.error('Failed to send reminder:', error);
      throw error;
    }
  }

  private async sendEmail({ to, template, data }: any) {
    const { error } = await supabase.functions.invoke('send-email', {
      body: { to, template, data }
    });
    if (error) throw error;
  }

  private async sendSMS({ to, template, data }: any) {
    const { error } = await supabase.functions.invoke('send-sms', {
      body: { to, template, data }
    });
    if (error) throw error;
  }

  private async logNotification(data: any) {
    const { error } = await supabase
      .from('notification_logs')
      .insert(data);
    if (error) throw error;
  }
}