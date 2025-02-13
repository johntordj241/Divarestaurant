import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Link, Bold, Italic, List, Heading, Eye, Calendar, Clock, Tag } from 'lucide-react';

interface ContentFormProps {
  initialData?: {
    id?: number;
    title: string;
    type: 'page' | 'article' | 'news';
    content: string;
    status: 'published' | 'draft';
    publishDate?: string;
    publishTime?: string;
    tags?: string[];
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
    };
  };
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ContentForm({ initialData, onClose, onSubmit }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'page',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    publishDate: initialData?.publishDate || '',
    publishTime: initialData?.publishTime || '',
    tags: initialData?.tags || [],
    seo: initialData?.seo || {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'scheduling'>('content');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    let newText = '';
    switch (tag) {
      case 'bold':
        newText = `${before}**${selection}**${after}`;
        break;
      case 'italic':
        newText = `${before}_${selection}_${after}`;
        break;
      case 'heading':
        newText = `${before}\n## ${selection}${after}`;
        break;
      case 'list':
        newText = `${before}\n- ${selection}${after}`;
        break;
      default:
        return;
    }

    setFormData(prev => ({ ...prev, content: newText }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto py-10">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-serif">
            {initialData ? 'Modifier le contenu' : 'Nouveau contenu'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Titre et Type */}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="page">Page</option>
                  <option value="article">Article</option>
                  <option value="news">Actualité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="scheduled">Programmé</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Ajouter un tag"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Tag size={20} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'content'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Contenu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scheduling')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'scheduling'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Programmation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'seo'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                SEO
              </button>
            </div>

            {/* Contenu */}
            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contenu
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Eye size={16} />
                    {showPreview ? 'Éditer' : 'Prévisualiser'}
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="flex gap-2 p-2 border-b bg-gray-50">
                    <button
                      type="button"
                      onClick={() => insertFormatting('bold')}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Gras"
                    >
                      <Bold size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('italic')}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Italique"
                    >
                      <Italic size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('heading')}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Titre"
                    >
                      <Heading size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('list')}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Liste"
                    >
                      <List size={20} />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Ajouter une image"
                    >
                      <ImageIcon size={20} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Ajouter un lien"
                    >
                      <Link size={20} />
                    </button>
                  </div>
                  {showPreview ? (
                    <div 
                      className="prose prose-sm max-w-none p-4"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  ) : (
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[300px] focus:ring-0 border-0"
                      placeholder="Écrivez votre contenu ici..."
                      required
                    />
                  )}
                </div>
              </div>
            )}

            {/* Programmation */}
            {activeTab === 'scheduling' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de publication
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de publication
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="time"
                        value={formData.publishTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, publishTime: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, metaTitle: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Titre optimisé pour les moteurs de recherche"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description SEO
                  </label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, metaDescription: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    rows={4}
                    placeholder="Description optimisée pour les moteurs de recherche"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mots-clés
                  </label>
                  <input
                    type="text"
                    value={formData.seo.keywords}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, keywords: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Mots-clés séparés par des virgules"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
            >
              <Save size={20} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}