interface EmailData {
  to: string;
  subject: string;
  template: 'confirmation' | 'reminder' | 'cancellation';
  data: Record<string, any>;
}

export async function sendEmail({ to, subject, template, data }: EmailData) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
    },
    body: JSON.stringify({ 
      to, 
      subject, 
      template, 
      data,
      from: 'Diva Restaurant <reservations@diva-restaurant.com>'
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
  
  return response.json();
}