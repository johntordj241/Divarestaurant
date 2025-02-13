import { useState } from 'react';
import { processPayment } from './stripe';
import { PAYMENT_CONFIG } from './config';

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (amount: number, paymentMethodId: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processPayment(paymentMethodId, amount);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateDeposit = (totalAmount: number) => {
    return Math.round((totalAmount * PAYMENT_CONFIG.DEPOSIT_PERCENTAGE) / 100);
  };

  return {
    isProcessing,
    error,
    handlePayment,
    calculateDeposit,
  };
}