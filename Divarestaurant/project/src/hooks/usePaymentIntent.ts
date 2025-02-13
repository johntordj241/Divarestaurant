import { useState, useEffect } from 'react';
import { createPaymentIntent } from '../lib/api/payment';

export function usePaymentIntent(amount: number) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializePayment() {
      try {
        setIsLoading(true);
        const { clientSecret } = await createPaymentIntent(amount);
        setClientSecret(clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize payment'));
      } finally {
        setIsLoading(false);
      }
    }

    if (amount > 0) {
      initializePayment();
    }
  }, [amount]);

  return { clientSecret, isLoading, error };
}