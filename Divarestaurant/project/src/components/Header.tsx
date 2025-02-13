import React, { useState } from 'react';
import { Wine, Settings, Menu, X, Mail } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);

  const menuItems = [
    { id: 'home', label: 'HOME' },
    { id: 'menu', label: 'MENU' },
    { id: 'shows', label: 'SHOWS' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'club', label: 'CLUB' },
    { id: 'booking', label: 'BOOKING' },
    { id: 'about', label: 'ABOUT' },
    { id: 'blog', label: 'BLOG' },
    { id: 'faq', label: 'FAQ' },
    { id: 'recruitment', label: 'RECRUITMENT' }
  ];

  const handleMenuClick = (id: string) => {
    onPageChange(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-sm border-b border-burgundy/10">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <Wine className="h-12 w-12 text-burgundy" />
            <span className="text-2xl font-serif text-burgundy">DIVA</span>
          </a>

          {/* Menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white hover:text-burgundy transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-8 text-sm tracking-[0.2em]">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.id);
                  }}
                  className={`
                    relative px-2 py-1
                    ${currentPage === item.id ? 'text-burgundy' : 'text-white/80'}
                    hover:text-burgundy transition-colors
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:w-full after:h-[1px] after:bg-burgundy 
                    after:scale-x-0 hover:after:scale-x-100
                    after:transition-transform after:duration-300
                    ${currentPage === item.id ? 'after:scale-x-100' : ''}
                  `}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewsletter(true)}
                className="flex items-center gap-2 px-4 py-2 border border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors rounded-md"
              >
                <Mail size={16} />
                NEWSLETTER
              </button>

              <button
                onClick={() => handleMenuClick('admin')}
                className="flex items-center gap-2 px-4 py-2 border border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors rounded-md"
              >
                <Settings size={16} />
                ADMIN
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[73px] bg-black/95 lg:hidden z-50">
            <div className="flex flex-col items-center py-8 space-y-6">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.id);
                  }}
                  className={`
                    text-lg ${currentPage === item.id ? 'text-burgundy' : 'text-white/80'}
                    hover:text-burgundy transition-colors
                  `}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setShowNewsletter(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-6 py-3 border border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors rounded-md"
              >
                <Mail size={16} />
                NEWSLETTER
              </button>
              <button
                onClick={() => handleMenuClick('admin')}
                className="flex items-center gap-2 px-6 py-3 border border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors rounded-md"
              >
                <Settings size={16} />
                ADMIN
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Newsletter Modal */}
      {showNewsletter && (
        <NewsletterModal onClose={() => setShowNewsletter(false)} />
      )}
    </header>
  );
}

function NewsletterModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;
      setStatus('success');
      setEmail('');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 rounded-lg p-8 max-w-md w-full border border-burgundy/20 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-serif text-gold mb-4">Newsletter</h2>
        <p className="text-gray-300 mb-6">
          Inscrivez-vous pour recevoir nos actualités, offres spéciales et dates de spectacles en avant-première.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gold text-black py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Inscription...' : 'S\'inscrire'}
          </button>

          {status === 'success' && (
            <p className="text-green-500 text-center">Inscription réussie !</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-center">Une erreur est survenue. Veuillez réessayer.</p>
          )}
        </form>
      </div>
    </div>
  );
}