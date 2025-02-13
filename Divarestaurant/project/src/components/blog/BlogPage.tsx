import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Soirée Jazz & Gastronomie",
    excerpt: "Retour sur notre dernière soirée thématique mêlant jazz et cuisine raffinée...",
    date: "2024-01-10",
    author: "Marie Laurent",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Les secrets de notre Chef",
    excerpt: "Interview exclusive avec notre Chef étoilé sur sa vision de la gastronomie...",
    date: "2024-01-05",
    author: "Pierre Dubois",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80"
  }
];

export function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">ACTUALITÉS</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="bg-white/5 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-serif text-gold mb-4">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors">
                    Lire plus
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}