import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });

      if (confirmError) throw confirmError;
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Montant total</p>
        <p className="text-2xl font-serif">{amount}€</p>
      </div>

      <PaymentElement />

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-gold text-black py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock size={20} />
        {loading ? 'Traitement...' : 'Payer en toute sécurité'}
      </button>
    </form>
  );
}