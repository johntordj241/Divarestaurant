import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">CONTACT</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg">
            <h2 className="text-2xl font-serif mb-6 text-gold">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white h-32"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gold text-black py-3 rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Envoyer
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif mb-6 text-gold">Nos établissements</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-gold shrink-0" />
                  <div>
                    <h3 className="font-serif text-white mb-2">Nice</h3>
                    <p className="text-gray-300">123 Promenade des Anglais</p>
                    <p className="text-gray-300">06000 Nice</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-gold shrink-0" />
                  <div>
                    <h3 className="font-serif text-white mb-2">Cannes</h3>
                    <p className="text-gray-300">45 La Croisette</p>
                    <p className="text-gray-300">06400 Cannes</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif mb-6 text-gold">Contact direct</h2>
              <div className="space-y-4">
                <a 
                  href="tel:+33493000000"
                  className="flex items-center gap-4 text-gray-300 hover:text-gold transition-colors"
                >
                  <Phone className="text-gold" />
                  <span>+33 4 93 00 00 00</span>
                </a>
                <a 
                  href="mailto:contact@diva-restaurant.com"
                  className="flex items-center gap-4 text-gray-300 hover:text-gold transition-colors"
                >
                  <Mail className="text-gold" />
                  <span>contact@diva-restaurant.com</span>
                </a>
              </div>
            </div>

            {/* Carte Google Maps */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.847814414936!2d7.2580!3d43.6960!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDQxJzQ1LjYiTiA3wrAxNScyOC44IkU!5e0!3m2!1sfr!2sfr!4v1641911611693!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}