import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '../supabase/client';

export class StripeService {
  private static instance: StripeService;
  private stripe: Promise<Stripe | null>;

  private constructor() {
    this.stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
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
  }
}