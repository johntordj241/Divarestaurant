import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Search, X } from 'lucide-react';

interface MediaSelectorProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function MediaSelector({ onSelect, onClose }: MediaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock media data
  const mediaItems = [
    { id: 1, url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', type: 'image', name: 'Ambiance 1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', type: 'image', name: 'Spectacle 1' },
    { id: 3, url: 'https://images.unsplash.com/photo-1485872299829-c673f5194813', type: 'image', name: 'Dîner 1' }
  ];

  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Sélectionner un média</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-4 mb-4">
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
            <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90">
              <Upload size={20} />
              Importer
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {filteredMedia.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.url)}
                className="group relative aspect-square rounded-lg overflow-hidden border hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="text-white" size={24} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}