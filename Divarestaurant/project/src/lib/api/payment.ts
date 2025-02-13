import { supabase } from '../supabase/client';

interface PaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(amount: number): Promise<PaymentIntentResponse> {
  const { data, error } = await supabase
    .functions.invoke('create-payment-intent', {
      body: { amount }
    });

  if (error) throw error;
  return data;
}

export async function confirmPayment(paymentIntentId: string) {
  const { data, error } = await supabase
    .functions.invoke('confirm-payment', {
      body: { paymentIntentId }
    });

  if (error) throw error;
  return data;
}