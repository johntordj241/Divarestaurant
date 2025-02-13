export const NOTIFICATION_TEMPLATES = {
  CONFIRMATION: {
    subject: 'Confirmation de votre réservation - La Diva Cabaret',
    template: 'confirmation',
  },
  REMINDER: {
    subject: 'Rappel - Votre soirée à La Diva Cabaret demain',
    template: 'reminder',
  },
  THANK_YOU: {
    subject: 'Merci pour votre visite - La Diva Cabaret',
    template: 'thank-you',
  },
} as const;