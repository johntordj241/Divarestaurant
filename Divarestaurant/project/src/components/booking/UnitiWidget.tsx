import React, { useEffect } from 'react';

interface UnitiWidgetProps {
  restaurantId: string;
}

export function UnitiWidget({ restaurantId }: UnitiWidgetProps) {
  useEffect(() => {
    // Chargement du script Uniiti
    const script = document.createElement('script');
    script.src = 'https://booking.uniiti.com/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialisation du widget une fois le script chargé
    script.onload = () => {
      if (window.Uniiti) {
        window.Uniiti.init({
          restaurantId: restaurantId,
          lang: 'fr',
          theme: 'dark'
        });
      }
    };

    return () => {
      document.body.removeChild(script);
      // Nettoyage du widget si nécessaire
      if (window.Uniiti && window.Uniiti.destroy) {
        window.Uniiti.destroy();
      }
    };
  }, [restaurantId]);

  return (
    <div id="uniiti-widget" className="w-full h-[600px] bg-dark/50">
      {/* Le widget Uniiti sera injecté ici */}
    </div>
  );
}