import React from 'react';
import { Instagram } from 'lucide-react';

const SOCIAL_POSTS = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    caption: 'Live Performance Night'
  },
  {
    id: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80',
    caption: 'Cocktail Masterpiece'
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
    caption: 'Dinner & Show'
  },
  {
    id: 4,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
    caption: 'DJ Night'
  },
  {
    id: 5,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80',
    caption: 'Piano Bar Evening'
  },
  {
    id: 6,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1535359056830-d4badde79747?auto=format&fit=crop&q=80',
    caption: 'Culinary Excellence'
  }
];

export function SocialWall() {
  return (
    <section className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-12">
          <Instagram size={24} className="text-gold" />
          <h2 className="text-3xl font-serif">FOLLOW OUR STORY</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SOCIAL_POSTS.map((post) => (
            <div key={post.id} className="relative group overflow-hidden">
              <img
                src={post.url}
                alt={post.caption}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-center px-4">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://instagram.com/Diva__restaurant" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
          >
            @Diva__restaurant
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}