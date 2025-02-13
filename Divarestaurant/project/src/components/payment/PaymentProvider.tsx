import React from 'react';
import { Elements } from '@stripe/stripe-react-js';
import { loadStripe } from '@stripe/stripe-js';
import { usePaymentIntent } from '../../hooks/usePaymentIntent';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentProviderProps {
  amount: number;
  children: React.ReactNode;
}

export function PaymentProvider({ amount, children }: PaymentProviderProps) {
  const { clientSecret, isLoading, error } = usePaymentIntent(amount);

  if (isLoading) {
    return <div>Chargement du système de paiement...</div>;
  }

  if (error || !clientSecret) {
    return <div className="text-red-500">Erreur de chargement du système de paiement</div>;
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ clientSecret, appearance: { theme: 'stripe' } }}
    >
      {children}
    </Elements>
  );
}