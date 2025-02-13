import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Globe } from 'lucide-react';
import { ChatbotService } from '../lib/chatbot/ChatbotService';
import { Message } from '../types/chatbot';
import { Language } from '../lib/chatbot/i18n/translations';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('fr');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotService = ChatbotService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !conversationId) {
      startNewConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewConversation = async () => {
    try {
      const { id, welcomeMessage } = await chatbotService.startConversation(language);
      setConversationId(id);
      
      const welcomeMsg = {
        id: 'welcome',
        type: 'bot' as const,
        content: welcomeMessage,
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: input,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await chatbotService.handleMessage(input, language);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: response,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
    setConversationId(null);
    setMessages([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gold text-black rounded-full shadow-lg hover:bg-gold/90 transition-colors"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gold p-4 flex justify-between items-center">
            <h3 className="text-black font-medium">Assistant La Diva</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="text-black hover:text-black/70"
                title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
              >
                <Globe size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:text-black/70"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gold text-black'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'fr' ? 'Tapez votre message...' : 'Type your message...'}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-800"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}