import { supabase } from '../supabase/client';
import { Message } from '../../types/chatbot';
import { translate, Language } from './i18n/translations';

export class ChatbotService {
  private static instance: ChatbotService;
  private fallbackMode: boolean = true; // Start in fallback mode by default

  private constructor() {}

  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  async startConversation(language: Language = 'fr'): Promise<{ id: string; welcomeMessage: string }> {
    // Always use fallback mode for now since Supabase isn't configured
    return {
      id: 'temp-' + Date.now(),
      welcomeMessage: translate('welcome', language)
    };
  }

  async handleMessage(message: string, language: Language = 'fr'): Promise<string> {
    // Simple keyword-based responses
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('réserv') || messageLower.includes('book')) {
      return translate('reservation.ask_guests', language);
    }
    if (messageLower.includes('menu') || messageLower.includes('carte')) {
      return translate('menu.show_menu', language);
    }
    if (messageLower.includes('horaire') || messageLower.includes('hour')) {
      return translate('hours', language);
    }
    if (messageLower.includes('contact') || messageLower.includes('téléphone') || messageLower.includes('phone')) {
      return translate('contact.info', language);
    }
    if (messageLower.includes('merci') || messageLower.includes('thank')) {
      return translate('thanks', language);
    }

    // Default response
    return translate('help', language);
  }
}