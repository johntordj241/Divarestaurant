import React, { useState } from 'react';
import { FileText, Edit, Trash2, Plus, Search, Filter, Calendar, Clock, Eye, AlertCircle } from 'lucide-react';
import { ContentForm } from './forms/ContentForm';

interface ContentItem {
  id: number;
  title: string;
  type: 'page' | 'article' | 'news';
  status: 'published' | 'draft' | 'scheduled';
  lastModified: string;
  author: string;
  scheduledFor?: string;
  views?: number;
  content?: string;
}

export function ContentManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const MOCK_CONTENT: ContentItem[] = [
    { 
      id: 1, 
      title: 'À propos de nous', 
      type: 'page', 
      status: 'published',
      lastModified: '2024-01-10',
      author: 'Admin',
      views: 1250,
      content: 'Contenu de la page À propos'
    },
    { 
      id: 2, 
      title: 'Conditions générales', 
      type: 'page', 
      status: 'published',
      lastModified: '2024-01-09',
      author: 'Admin',
      views: 450,
      content: 'Contenu des conditions générales'
    },
    { 
      id: 3, 
      title: 'Actualité spectacles', 
      type: 'article', 
      status: 'published',
      lastModified: '2024-01-08',
      author: 'Marketing',
      views: 2800,
      content: 'Contenu de l\'actualité spectacles'
    },
    { 
      id: 4, 
      title: 'Menu de la Saint-Valentin', 
      type: 'news', 
      status: 'scheduled',
      lastModified: '2024-01-15',
      scheduledFor: '2024-02-10T18:00:00',
      author: 'Chef',
      views: 0,
      content: 'Contenu du menu spécial'
    }
  ];

  const filteredContent = MOCK_CONTENT
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          : new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
      }
      if (sortBy === 'title') {
        return sortOrder === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
      // Sort by views
      return sortOrder === 'desc'
        ? (b.views || 0) - (a.views || 0)
        : (a.views || 0) - (b.views || 0);
    });

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setShowContentForm(true);
  };

  const handleDelete = (item: ContentItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleNewContent = () => {
    setSelectedItem(null);
    setShowContentForm(true);
  };

  const handleSubmitContent = (data: any) => {
    // Implement save logic here
    console.log('Saving content:', data);
    setShowContentForm(false);
    setSelectedItem(null);
  };

  const confirmDelete = () => {
    // Implement delete logic here
    console.log('Deleting content:', selectedItem);
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const toggleSort = (field: 'date' | 'title' | 'views') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion du contenu</h2>
        <button 
          onClick={handleNewContent}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
        >
          <Plus size={20} />
          Nouveau contenu
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="page">Pages</option>
              <option value="article">Articles</option>
              <option value="news">Actualités</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="scheduled">Programmé</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => toggleSort('title')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Titre
                  {sortBy === 'title' && (
                    <span className="text-gold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => toggleSort('views')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Vues
                  {sortBy === 'views' && (
                    <span className="text-gold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => toggleSort('date')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Dernière modification
                  {sortBy === 'date' && (
                    <span className="text-gold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContent.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="text-gray-400 mr-3" size={20} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${item.type === 'page' ? 'bg-blue-100 text-blue-800' : 
                      item.type === 'article' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'}`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${item.status === 'published' ? 'bg-green-100 text-green-800' : 
                      item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {item.status === 'scheduled' && <Clock size={12} />}
                    {item.status === 'published' ? 'Publié' : 
                     item.status === 'draft' ? 'Brouillon' : 'Programmé'}
                  </span>
                  {item.scheduledFor && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.scheduledFor).toLocaleString('fr-FR')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.author}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.views?.toLocaleString('fr-FR') || '0'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(item.lastModified).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Prévisualiser"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium">Confirmer la suppression</h3>
                <p className="text-gray-600 mt-1">
                  Êtes-vous sûr de vouloir supprimer "{selectedItem.title}" ? 
                  Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de contenu */}
      {showContentForm && (
        <ContentForm
          initialData={selectedItem || undefined}
          onClose={() => {
            setShowContentForm(false);
            setSelectedItem(null);
          }}
          onSubmit={handleSubmitContent}
        />
      )}
    </div>
  );
}