import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, Columns, Download, Share2, Eye, X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';

type ViewMode = 'grid' | 'masonry';
type MediaType = 'all' | 'image' | 'video';
type SortOption = 'date' | 'name' | 'size';

interface FilterOptions {
  type: MediaType;
  date: string | null;
  tags: string[];
  search: string;
}

export function MediaGallery() {
  const { mediaItems, isLoading } = useMedia();
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    date: null,
    tags: [],
    search: ''
  });
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableTags] = useState(['Spectacle', 'Ambiance', 'Cuisine', 'Événements', 'VIP']);

  // Filtrage et tri des médias
  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || item.type === filters.type;
    const matchesDate = !filters.date || new Date(item.created_at).toDateString() === new Date(filters.date).toDateString();
    const matchesTags = filters.tags.length === 0 || (item.metadata?.tags && filters.tags.every(tag => item.metadata.tags.includes(tag)));
    return matchesSearch && matchesType && matchesDate && matchesTags;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  // Diaporama automatique
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedItem) {
      interval = setInterval(() => {
        navigateLightbox('next');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedItem]);

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'La Diva Cabaret',
          text: 'Découvrez nos moments magiques',
          url
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
        // Fallback vers la copie dans le presse-papier
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier');
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier');
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredMedia.length - 1));
    } else {
      setLightboxIndex((prev) => (prev < filteredMedia.length - 1 ? prev + 1 : 0));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">GALERIE</h1>

        {/* Filtres avancés */}
        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as MediaType }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="all">Tous les types</option>
                <option value="image">Photos</option>
                <option value="video">Vidéos</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={filters.date || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="date">Trier par date</option>
                <option value="name">Trier par nom</option>
                <option value="size">Trier par taille</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="text-gray-400" size={20} />
              <span className="text-white">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    tags: prev.tags.includes(tag)
                      ? prev.tags.filter(t => t !== tag)
                      : [...prev.tags, tag]
                  }))}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-gold text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options d'affichage */}
        <div className="flex justify-end gap-4 mb-8">
          <div className="flex gap-2 border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
              title="Vue grille"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 ${viewMode === 'masonry' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
              title="Vue mosaïque"
            >
              <Columns size={20} />
            </button>
          </div>
        </div>

        {/* Grille de médias */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'
        }`}>
          {filteredMedia.map((item, index) => (
            <div
              key={item.id}
              className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                viewMode === 'masonry' ? 'break-inside-avoid' : ''
              }`}
              onClick={() => {
                setSelectedItem(item);
                setLightboxIndex(index);
              }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full aspect-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full aspect-video object-cover"
                  controls
                  playsInline
                  muted
                  crossOrigin="anonymous"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-medium truncate">{item.name}</h3>
                  {item.metadata?.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.metadata.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item.url, item.name);
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Download size={16} className="text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(item.url);
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Share2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsPlaying(false);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            >
              <X size={24} />
            </button>

            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>

            <div className="max-w-5xl w-full mx-4">
              {filteredMedia[lightboxIndex].type === 'image' ? (
                <img
                  src={filteredMedia[lightboxIndex].url}
                  alt={filteredMedia[lightboxIndex].name}
                  className="w-full h-[80vh] object-contain rounded-lg"
                  crossOrigin="anonymous"
                />
              ) : (
                <video
                  src={filteredMedia[lightboxIndex].url}
                  className="w-full h-[80vh] object-contain rounded-lg"
                  controls
                  autoPlay
                  playsInline
                  crossOrigin="anonymous"
                />
              )}

              <div className="mt-4 text-white">
                <h3 className="text-xl font-medium">{filteredMedia[lightboxIndex].name}</h3>
                <p className="text-gray-400">
                  {new Date(filteredMedia[lightboxIndex].created_at).toLocaleDateString('fr-FR')}
                </p>
                {filteredMedia[lightboxIndex].metadata?.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filteredMedia[lightboxIndex].metadata.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleDownload(filteredMedia[lightboxIndex].url, filteredMedia[lightboxIndex].name)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Download size={20} />
                    Télécharger
                  </button>
                  <button
                    onClick={() => handleShare(filteredMedia[lightboxIndex].url)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Share2 size={20} />
                    Partager
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Eye size={20} />
                    {isPlaying ? 'Arrêter' : 'Diaporama'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}