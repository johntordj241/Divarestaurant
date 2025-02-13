import { sendEmail } from './email';
import { NOTIFICATION_TEMPLATES } from './config';
import { Reservation } from '../../types';

export async function sendConfirmationEmail(reservation: Reservation) {
  return sendEmail({
    to: reservation.customerEmail,
    ...NOTIFICATION_TEMPLATES.CONFIRMATION,
    data: {
      reservation,
      cancellationPolicy: {
        hours: 48,
        feePercentage: 50,
      },
    },
  });
}

export async function sendReminderEmail(reservation: Reservation) {
  return sendEmail({
    to: reservation.customerEmail,
    ...NOTIFICATION_TEMPLATES.REMINDER,
    data: { reservation },
  });
}

export async function sendThankYouEmail(reservation: Reservation) {
  return sendEmail({
    to: reservation.customerEmail,
    ...NOTIFICATION_TEMPLATES.THANK_YOU,
    data: { reservation },
  });
}