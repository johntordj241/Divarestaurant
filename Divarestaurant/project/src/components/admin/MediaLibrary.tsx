import React, { useState, useCallback } from 'react';
import { Image, Upload, Trash2, AlertCircle, Filter, Search, Eye, Link } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import { MediaOptimizer } from '../../lib/media/MediaOptimizer';
import { supabase } from '../../lib/supabase/client';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  location: 'hero' | 'gallery' | 'shows';
}

export function MediaLibrary() {
  const { mediaItems, isLoading, error, uploadMedia, deleteMedia } = useMedia();
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | 'hero' | 'gallery' | 'shows'>('all');
  const [showExternalUrlInput, setShowExternalUrlInput] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalMediaName, setExternalMediaName] = useState('');
  const mediaOptimizer = MediaOptimizer.getInstance();
  const [items, setItems] = useState<MediaItem[]>(mediaItems);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let processedFile: File;
      
      if (file.type.startsWith('image/')) {
        const optimizedBlob = await mediaOptimizer.optimizeImage(file);
        processedFile = new File([optimizedBlob], file.name, { type: file.type });
      } else {
        processedFile = file;
      }

      const result = await uploadMedia(processedFile);
      if (result) {
        setItems(prev => [result, ...prev]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [uploadMedia]);

  const handleExternalMediaSubmit = async () => {
    try {
      if (!externalUrl || !externalMediaName) {
        throw new Error('Veuillez remplir tous les champs');
      }

      // Vérifier si l'URL est valide
      new URL(externalUrl);

      const result = await uploadMedia({
        url: externalUrl,
        name: externalMediaName,
        type: activeTab === 'images' ? 'image' : 'video',
        location: 'gallery'
      });

      if (result) {
        setItems(prev => [result, ...prev]);
      }

      setExternalUrl('');
      setExternalMediaName('');
      setShowExternalUrlInput(false);
    } catch (error) {
      console.error('External media upload failed:', error);
    }
  };

  const handleLocationChange = async (mediaId: string, newLocation: 'hero' | 'gallery' | 'shows') => {
    try {
      const { error: updateError } = await supabase
        .from('media')
        .update({ location: newLocation })
        .eq('id', mediaId);

      if (updateError) throw updateError;

      setItems(prev => prev.map(item => 
        item.id === mediaId ? { ...item, location: newLocation } : item
      ));
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      await deleteMedia(mediaId);
      setItems(prev => prev.filter(item => item.id !== mediaId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredMedia = items.filter(item => {
    const matchesType = activeTab === 'images' ? item.type === 'image' : item.type === 'video';
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    return matchesType && matchesSearch && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Médiathèque</h2>
        <div className="flex gap-4">
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'images' ? 'bg-gold text-black' : 'bg-white'
              }`}
            >
              <Image size={20} />
              Images
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'videos' ? 'bg-gold text-black' : 'bg-white'
              }`}
            >
              <Eye size={20} />
              Vidéos
            </button>
          </div>
          <button
            onClick={() => setShowExternalUrlInput(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
          >
            <Link size={20} />
            Ajouter depuis une URL
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors cursor-pointer">
            <Upload size={20} />
            {activeTab === 'images' ? 'Ajouter une image' : 'Ajouter une vidéo'}
            <input
              type="file"
              className="hidden"
              accept={activeTab === 'images' ? "image/*" : "video/*"}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Toutes les sections</option>
            <option value="hero">Page d'accueil</option>
            <option value="gallery">Galerie</option>
            <option value="shows">Spectacles</option>
          </select>
        </div>
      </div>

      {showExternalUrlInput && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-serif mb-4">Ajouter un média depuis une URL</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du média
              </label>
              <input
                type="text"
                value={externalMediaName}
                onChange={(e) => setExternalMediaName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Nom du média"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL du média
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://example.com/media.jpg"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowExternalUrlInput(false);
                  setExternalUrl('');
                  setExternalMediaName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleExternalMediaSubmit}
                className="px-6 py-2 bg-gold text-black rounded-md hover:bg-gold/90"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredMedia.map((media) => (
          <div key={media.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video relative">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  controls
                  controlsList="nodownload"
                  playsInline
                  muted
                  crossOrigin="anonymous"
                />
              )}
              <button
                onClick={() => handleDelete(media.id)}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 transition-colors text-white rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <p className="font-medium truncate">{media.name}</p>
              <p className="text-sm text-gray-500">
                {(media.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <select
                className="mt-2 w-full p-2 border rounded-md"
                value={media.location}
                onChange={(e) => handleLocationChange(media.id, e.target.value as 'hero' | 'gallery' | 'shows')}
              >
                <option value="hero">Page d'accueil</option>
                <option value="gallery">Galerie</option>
                <option value="shows">Spectacles</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}