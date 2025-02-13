/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-red': '#8B0000',
        'burgundy': '#8B0000',
        'gold': '#D4AF37',
        'champagne': '#F7E7CE',
        'dark': '#0A0A0A',
        'admin-bg': '#1a1a1a',
        'admin-card': 'rgba(30, 30, 30, 0.95)',
        'admin-text': '#ffffff',
        'admin-text-secondary': 'rgba(255, 255, 255, 0.7)'
      },
      fontFamily: {
        serif: ['Didot', 'Playfair Display', 'serif'],
        sans: ['Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(45deg, #D4AF37 0%, #FFE5B4 50%, #D4AF37 100%)',
        'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
      },
      backgroundColor: {
        'modal-backdrop': 'rgba(0, 0, 0, 0.85)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gold-shimmer': 'shimmer 2s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        }
      },
      boxShadow: {
        'gold': '0 0 15px rgba(212, 175, 55, 0.3)',
        'gold-hover': '0 0 20px rgba(212, 175, 55, 0.5)'
      }
    },
  },
  plugins: [],
};