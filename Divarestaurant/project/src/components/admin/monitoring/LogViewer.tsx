import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Clock, User, RefreshCw } from 'lucide-react';

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  user?: string;
  metadata?: Record<string, any>;
}

export function LogViewer() {
  const [logs, setLogs] = useState<Log[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Erreur lors du chargement de la vidéo',
      source: 'VideoPlayer',
      metadata: {
        videoId: 'video-123',
        error: 'Format non supporté'
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: 'warning',
      message: 'Temps de chargement élevé',
      source: 'MediaGallery',
      metadata: {
        loadTime: '2.5s',
        threshold: '2s'
      }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      level: 'info',
      message: 'Nouvelle vidéo téléchargée',
      source: 'MediaUploader',
      user: 'admin@diva-restaurant.com',
      metadata: {
        fileSize: '15.4MB',
        duration: '2:30'
      }
    }
  ]);

  const [filters, setFilters] = useState({
    level: 'all',
    source: 'all',
    search: ''
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-500/10';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'info':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filters.level === 'all' || log.level === filters.level;
    const matchesSource = filters.source === 'all' || log.source === filters.source;
    const matchesSearch = !filters.search || 
      log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.source.toLowerCase().includes(filters.search.toLowerCase());
    return matchesLevel && matchesSource && matchesSearch;
  });

  const sources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gold">Logs Système</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90">
          <RefreshCw size={20} />
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher dans les logs..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filters.level}
            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">Tous les niveaux</option>
            <option value="error">Erreurs</option>
            <option value="warning">Avertissements</option>
            <option value="info">Informations</option>
          </select>
        </div>

        <select
          value={filters.source}
          onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="all">Toutes les sources</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      {/* Liste des logs */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-admin-card p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${getLevelColor(log.level)}`}>
                <AlertTriangle size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-white">{log.message}</p>
                    <p className="text-sm text-gray-400">Source: {log.source}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                    {log.user && (
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{log.user}</span>
                      </div>
                    )}
                  </div>
                </div>

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="mt-2 p-2 bg-white/5 rounded text-sm">
                    <pre className="text-gray-400 overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}