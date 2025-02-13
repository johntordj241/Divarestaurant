export const translations = {
  fr: {
    welcome: 'Bonjour ! Je suis l\'assistant virtuel de La Diva Cabaret. Comment puis-je vous aider ?',
    help: 'Je peux vous aider avec :\n- Les réservations\n- Le menu et les options alimentaires\n- Les horaires d\'ouverture\n- Les informations de contact\nQue souhaitez-vous savoir ?',
    error: 'Désolé, une erreur est survenue. Veuillez réessayer ou nous contacter directement.',
    thanks: 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.',
    hours: 'Nous sommes ouverts du mardi au dimanche de 19h à 2h. La cuisine est ouverte jusqu\'à 23h.',
    reservation: {
      ask_guests: 'Pour combien de personnes souhaitez-vous réserver ?',
      ask_date: 'Pour quelle date souhaitez-vous réserver ?',
      ask_time: 'À quelle heure souhaitez-vous venir ?',
      confirm: 'Je confirme votre réservation pour {guests} personnes le {date} à {time}. Est-ce correct ?',
      success: 'Parfait ! Votre réservation est confirmée. Vous recevrez un email de confirmation.',
      error: 'Désolé, une erreur est survenue lors de la réservation. Veuillez réessayer ou nous contacter directement.',
      not_available: 'Désolé, nous sommes complets pour cette date et cet horaire. Souhaitez-vous voir d\'autres disponibilités ?'
    },
    menu: {
      ask_preferences: 'Avez-vous des préférences particulières ? (végétarien, sans gluten, etc.)',
      show_menu: 'Vous pouvez consulter notre menu complet dans la section Menu. Nous proposons des options végétariennes, sans gluten et des menus spéciaux. Souhaitez-vous des recommandations ?'
    },
    contact: {
      info: 'Vous pouvez nous joindre au +33 4 93 00 00 00 ou par email à contact@diva-restaurant.com. Nous sommes situés au 123 Promenade des Anglais, 06000 Nice.'
    }
  },
  en: {
    welcome: 'Hello! I\'m La Diva Cabaret\'s virtual assistant. How can I help you?',
    help: 'I can help you with:\n- Reservations\n- Menu and dining options\n- Opening hours\n- Contact information\nWhat would you like to know?',
    error: 'Sorry, an error occurred. Please try again or contact us directly.',
    thanks: 'You\'re welcome! Feel free to ask if you have any other questions.',
    hours: 'We are open Tuesday to Sunday from 7 PM to 2 AM. The kitchen is open until 11 PM.',
    reservation: {
      ask_guests: 'For how many people would you like to make a reservation?',
      ask_date: 'For which date would you like to book?',
      ask_time: 'What time would you like to come?',
      confirm: 'I confirm your reservation for {guests} people on {date} at {time}. Is this correct?',
      success: 'Perfect! Your reservation is confirmed. You will receive a confirmation email.',
      error: 'Sorry, an error occurred during the reservation. Please try again or contact us directly.',
      not_available: 'Sorry, we are fully booked for this date and time. Would you like to see other availabilities?'
    },
    menu: {
      ask_preferences: 'Do you have any specific preferences? (vegetarian, gluten-free, etc.)',
      show_menu: 'You can view our complete menu in the Menu section. We offer vegetarian, gluten-free options and special menus. Would you like any recommendations?'
    },
    contact: {
      info: 'You can reach us at +33 4 93 00 00 00 or by email at contact@diva-restaurant.com. We are located at 123 Promenade des Anglais, 06000 Nice.'
    }
  }
};

export type Language = 'fr' | 'en';
export type TranslationKey = string;

export function translate(key: TranslationKey, lang: Language = 'fr', params?: Record<string, string>): string {
  try {
    const keys = key.split('.');
    let text = keys.reduce((obj, k) => obj[k], translations[lang] as any);
    
    if (typeof text !== 'string') {
      throw new Error('Translation not found');
    }
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    
    return text;
  } catch (error) {
    console.error(`Translation error for key "${key}" in language "${lang}"`, error);
    return translations[lang].error;
  }
}