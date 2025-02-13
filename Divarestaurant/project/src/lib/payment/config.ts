import { loadStripe } from '@stripe/stripe-js';

export const PAYMENT_CONFIG = {
  DEPOSIT_PERCENTAGE: 30,
  CANCELLATION_HOURS: 48,
  CANCELLATION_FEE_PERCENTAGE: 50,
  CURRENCY: 'EUR',
  LOCALE: 'fr-FR'
};

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const STRIPE_ELEMENTS_OPTIONS = {
  appearance: {
    theme: 'night',
    variables: {
      colorPrimary: '#D4AF37',
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#ff4444',
      fontFamily: 'Helvetica Neue, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px'
    }
  },
  locale: 'fr'
};