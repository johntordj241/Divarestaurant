import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit, Trash2, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { MenuForm } from './forms/MenuForm';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string | null;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  allergens: string[];
  available: boolean;
}

interface Category {
  id: string;
  name: string;
}

export function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    available: true,
    search: '',
    dietary: [] as string[]
  });

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .order('name'),
        supabase
          .from('menu_categories')
          .select('*')
          .order('name')
      ]);

      if (itemsData.error) throw itemsData.error;
      if (categoriesData.error) throw categoriesData.error;

      setItems(itemsData.data);
      setCategories(categoriesData.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<MenuItem>) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(data)
          .eq('id', selectedItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert(data);
        if (error) throw error;
      }

      await loadMenuData();
      setShowForm(false);
      setSelectedItem(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await loadMenuData();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = !filters.category || item.category_id === filters.category;
    const matchesAvailability = !filters.available || item.available;
    const matchesSearch = !filters.search || 
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDietary = filters.dietary.length === 0 || 
      (filters.dietary.includes('vegetarian') && item.is_vegetarian) ||
      (filters.dietary.includes('gluten-free') && item.is_gluten_free);

    return matchesCategory && matchesAvailability && matchesSearch && matchesDietary;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion des Menus</h2>
        <button
          onClick={() => {
            setSelectedItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90"
        >
          <Plus size={20} />
          Ajouter un plat
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.dietary.includes('vegetarian')}
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  dietary: e.target.checked 
                    ? [...prev.dietary, 'vegetarian']
                    : prev.dietary.filter(d => d !== 'vegetarian')
                }));
              }}
              className="rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span>Végétarien</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.dietary.includes('gluten-free')}
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  dietary: e.target.checked 
                    ? [...prev.dietary, 'gluten-free']
                    : prev.dietary.filter(d => d !== 'gluten-free')
                }));
              }}
              className="rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span>Sans gluten</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                  <span className="text-xl font-serif">{item.price}€</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.is_vegetarian && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Végétarien
                    </span>
                  )}
                  {item.is_gluten_free && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Sans gluten
                    </span>
                  )}
                  {!item.available && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Non disponible
                    </span>
                  )}
                </div>

                {item.allergens && item.allergens.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Tag size={16} />
                    <span>Allergènes: {item.allergens.join(', ')}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-900"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <MenuForm
          initialData={selectedItem}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}