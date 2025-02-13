import { supabase } from '../supabase/client';
import { NotificationService } from '../notifications/NotificationService';
import { AnalyticsService } from './AnalyticsService';
import { NewsletterService } from './NewsletterService';
import { PaymentService } from './PaymentService';

export class AutomationService {
  private static instance: AutomationService;
  private notificationService: NotificationService;
  private analyticsService: AnalyticsService;
  private newsletterService: NewsletterService;
  private paymentService: PaymentService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.analyticsService = new AnalyticsService();
    this.newsletterService = new NewsletterService();
    this.paymentService = new PaymentService();
  }

  static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  // Newsletter Automation
  async scheduleNewsletter(template: string, audience: string) {
    try {
      const subscribers = await this.newsletterService.getSubscribers(audience);
      const campaign = await this.newsletterService.createCampaign(template);
      await this.newsletterService.scheduleCampaign(campaign.id, subscribers);
      return true;
    } catch (error) {
      console.error('Newsletter automation failed:', error);
      return false;
    }
  }

  // Analytics & Performance Monitoring
  async generateAnalyticsReport() {
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    try {
      const [reservations, visitors, conversions] = await Promise.all([
        this.getReservationsData(lastMonth),
        this.analyticsService.getVisitorData(lastMonth),
        this.analyticsService.getConversionData(lastMonth)
      ]);

      return {
        totalReservations: reservations?.length || 0,
        revenue: reservations?.reduce((sum, res) => sum + (res.total_price || 0), 0) || 0,
        averagePartySize: reservations?.reduce((sum, res) => sum + (res.number_of_guests || 0), 0) / (reservations?.length || 1) || 0,
        visitors: visitors.total,
        conversions: conversions.rate,
        topEvents: await this.analyticsService.getTopPerformingEvents()
      };
    } catch (error) {
      console.error('Analytics report generation failed:', error);
      throw error;
    }
  }

  // Automated Payments & Invoicing
  async processPaymentAndInvoice(reservationId: string) {
    try {
      const reservation = await this.getReservationDetails(reservationId);
      const payment = await this.paymentService.processPayment({
        amount: reservation.total_price,
        customerId: reservation.customer_id,
        description: `Reservation #${reservationId}`
      });

      if (payment.status === 'succeeded') {
        await this.paymentService.generateAndSendInvoice({
          reservationId,
          customerEmail: reservation.customer_email,
          amount: reservation.total_price,
          items: reservation.items
        });
      }

      return payment;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  // Loyalty System
  async updateLoyaltyPoints(customerId: string, amount: number) {
    try {
      const { data, error } = await supabase
        .from('customer_loyalty')
        .upsert({
          customer_id: customerId,
          points: amount,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Loyalty points update failed:', error);
      throw error;
    }
  }

  // Security & Backup
  async scheduleBackup() {
    try {
      const timestamp = new Date().toISOString();
      const { error } = await supabase.rpc('create_backup', { backup_name: `backup_${timestamp}` });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  // Private helper methods
  private async getReservationDetails(reservationId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, customer:profiles(*)')
      .eq('id', reservationId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getReservationsData(since: Date) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('created_at', since.toISOString());

    if (error) throw error;
    return data;
  }
}