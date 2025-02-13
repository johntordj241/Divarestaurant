import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing VITE_STRIPE_PUBLIC_KEY');
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createPaymentIntent(amount: number) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }
  
  return response.json();
}

export async function processPayment(paymentMethodId: string, amount: number) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  const { clientSecret } = await createPaymentIntent(amount);
  
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethodId,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}