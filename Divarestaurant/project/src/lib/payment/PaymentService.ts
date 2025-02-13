import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '../supabase/client';
import { NotificationService } from '../notifications/NotificationService';

export class PaymentService {
  private static instance: PaymentService;
  private stripe: Promise<Stripe | null>;
  private notificationService: NotificationService;

  private constructor() {
    this.stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPaymentIntent(amount: number, customerId: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount, customerId }
    });

    if (error) throw error;
    return data.clientSecret;
  }

  async confirmPayment(clientSecret: string, paymentMethod: string): Promise<Stripe.PaymentIntent> {
    const stripe = await this.stripe;
    if (!stripe) throw new Error('Stripe not initialized');

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    });

    if (error) throw error;
    if (!paymentIntent) throw new Error('Payment failed');

    // Log successful payment
    await this.logPayment(paymentIntent);

    // Send confirmation
    await this.sendPaymentConfirmation(paymentIntent);

    return paymentIntent;
  }

  async createSetupIntent(customerId: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-setup-intent', {
      body: { customerId }
    });

    if (error) throw error;
    return data.clientSecret;
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<void> {
    const { error } = await supabase.functions.invoke('create-refund', {
      body: { paymentIntentId, amount }
    });

    if (error) throw error;

    // Log refund
    await this.logRefund(paymentIntentId, amount);
  }

  private async logPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { error } = await supabase
      .from('payment_logs')
      .insert({
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  private async logRefund(paymentIntentId: string, amount?: number): Promise<void> {
    const { error } = await supabase
      .from('refund_logs')
      .insert({
        payment_intent_id: paymentIntentId,
        amount: amount,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  private async sendPaymentConfirmation(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { data: reservation } = await supabase
      .from('reservations')
      .select('customer_email, customer_name, date, time')
      .eq('payment_intent_id', paymentIntent.id)
      .single();

    if (reservation) {
      await this.notificationService.sendEmail(
        reservation.customer_email,
        'payment_confirmation',
        {
          name: reservation.customer_name,
          amount: paymentIntent.amount / 100,
          date: reservation.date,
          time: reservation.time
        }
      );
    }
  }
}