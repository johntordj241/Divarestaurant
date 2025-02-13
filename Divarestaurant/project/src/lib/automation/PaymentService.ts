import { supabase } from '../supabase/client';
import { loadStripe } from '@stripe/stripe-js';

export class PaymentService {
  private stripe: any;

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }

  async processPayment({ amount, customerId, description }: {
    amount: number;
    customerId: string;
    description: string;
  }) {
    try {
      const { data: paymentIntent, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, customerId, description }
      });

      if (error) throw error;

      const result = await this.stripe.confirmCardPayment(paymentIntent.client_secret);
      return result;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  async generateAndSendInvoice({ 
    reservationId, 
    customerEmail, 
    amount, 
    items 
  }: {
    reservationId: string;
    customerEmail: string;
    amount: number;
    items: any[];
  }) {
    try {
      const { data: invoice, error } = await supabase.functions.invoke('generate-invoice', {
        body: {
          reservationId,
          customerEmail,
          amount,
          items,
          date: new Date().toISOString()
        }
      });

      if (error) throw error;
      return invoice;
    } catch (error) {
      console.error('Invoice generation failed:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string) {
    try {
      const { data: refund, error } = await supabase.functions.invoke('create-refund', {
        body: { paymentIntentId }
      });

      if (error) throw error;
      return refund;
    } catch (error) {
      console.error('Refund failed:', error);
      throw error;
    }
  }

  async getPaymentHistory(customerId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  }
}