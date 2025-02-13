import React from 'react';

export function VideoCarousel() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
        <iframe 
          src="https://player.vimeo.com/video/1049060112?h=f8b2fa481d&badge=0&autopause=0&player_id=0&app_id=58479&background=1&autoplay=1&loop=1&byline=0&title=0&quality=1080p" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          title="diva test"
        />
      </div>
      
      {/* Overlay pour assombrir légèrement la vidéo */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Script Vimeo */}
      <script src="https://player.vimeo.com/api/player.js" async />
    </div>
  );
}