import React, { useState } from 'react';
import { Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';
import { supabase } from '../lib/supabase/client';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');

    try {
      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Adresse email invalide');
      }

      // Check if email already exists
      const { data: existingSubscriber } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingSubscriber) {
        throw new Error('Cette adresse email est déjà inscrite à la newsletter');
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ 
          email,
          subscribed_at: new Date().toISOString(),
          status: 'active'
        }]);

      if (insertError) throw insertError;

      setSubscribeStatus('success');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubscribeStatus('error');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus('idle');
      }, 3000);
    }
  };

  return (
    <footer className="bg-black/95 border-t border-burgundy/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo et Description */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="/images/logo-white.svg" 
              alt="Diva Logo" 
              className="h-16 w-auto mb-4"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.className = 'hidden';
              }}
            />
            <h2 className="text-2xl font-serif text-gold mb-4">DIVA RESTAURANT</h2>
            <p className="text-gray-400 text-center md:text-left">
              Une expérience gastronomique unique alliant cuisine raffinée et spectacles d'exception.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <a 
                href="tel:+33493000000" 
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Phone size={18} />
                <span>+33 4 93 00 00 00</span>
              </a>
              <a 
                href="mailto:contact@diva-restaurant.com"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Mail size={18} />
                <span>contact@diva-restaurant.com</span>
              </a>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">Adresse</h3>
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin size={18} className="shrink-0 mt-1" />
              <div>
                <p>11 Rue Bavastro</p>
                <p>06300 Nice, France</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">Newsletter</h3>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <p className="text-gray-400 text-sm">
                Inscrivez-vous pour recevoir nos actualités et offres spéciales.
              </p>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gold hover:text-gold/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              {subscribeStatus === 'success' && (
                <p className="text-green-500 text-sm">Inscription réussie !</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-red-500 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
              )}
            </form>
          </div>
        </div>

        {/* Social et Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-burgundy/10">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <a 
              href="https://instagram.com/Diva__restaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gold transition-colors"
            >
              <Instagram size={24} />
            </a>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Diva Restaurant. Tous droits réservés.</p>
            <p className="text-sm text-gray-500">Site réalisé par Tordjeman Labs</p>
          </div>
        </div>
      </div>
    </footer>
  );
}