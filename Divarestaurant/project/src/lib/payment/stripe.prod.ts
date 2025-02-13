```typescript
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase/client';

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function processPayment(amount: number, paymentMethodId: string) {
  try {
    // Create payment intent
    const { data: { clientSecret }, error: intentError } = await supabase
      .functions.invoke('create-payment-intent', {
        body: { amount }
      });

    if (intentError) throw intentError;

    // Confirm payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: paymentMethodId }
    );

    if (confirmError) throw confirmError;

    // Log successful payment
    await supabase.from('payments').insert({
      amount: amount,
      status: paymentIntent.status,
      payment_intent_id: paymentIntent.id,
      created_at: new Date().toISOString()
    });

    return paymentIntent;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
}

export async function handleRefund(paymentIntentId: string) {
  try {
    const { error } = await supabase
      .functions.invoke('create-refund', {
        body: { paymentIntentId }
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Refund failed:', error);
    throw error;
  }
}
```