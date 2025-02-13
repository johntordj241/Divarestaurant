import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { InventoryForm } from './InventoryForm';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minimum_quantity: number;
  category: string;
  supplier: string;
  last_order_date: string | null;
  price_per_unit: number;
}

export function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    lowStock: false,
    search: ''
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err) {
      setError('Erreur lors du chargement de l\'inventaire');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<InventoryItem>) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('inventory')
          .update(data)
          .eq('id', selectedItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert(data);
        if (error) throw error;
      }

      await loadInventory();
      setShowForm(false);
      setSelectedItem(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesLowStock = !filters.lowStock || item.quantity <= item.minimum_quantity;
    const matchesSearch = !filters.search || 
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesLowStock && matchesSearch;
  });

  const categories = Array.from(new Set(items.map(item => item.category)));
  const lowStockCount = items.filter(item => item.quantity <= item.minimum_quantity).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion des Stocks</h2>
        <div className="flex gap-4">
          <button
            onClick={loadInventory}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={20} />
            Actualiser
          </button>
          <button
            onClick={() => {
              setSelectedItem(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90"
          >
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Alertes de stock bas */}
      {lowStockCount > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-400 shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">
                {lowStockCount} produit{lowStockCount > 1 ? 's' : ''} en stock bas
              </h3>
              <p className="text-yellow-700 text-sm">
                Certains produits sont en dessous du seuil minimum. Vérifiez la liste ci-dessous.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.lowStock}
              onChange={(e) => setFilters(prev => ({ ...prev, lowStock: e.target.checked }))}
              className="rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span>Stock bas uniquement</span>
          </label>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Seuil Min.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fournisseur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prix Unitaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dernière Commande
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map(item => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  item.quantity <= item.minimum_quantity ? 'bg-red-50' : ''
                }`}
                onClick={() => {
                  setSelectedItem(item);
                  setShowForm(true);
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Package className="text-gray-400" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    item.quantity <= item.minimum_quantity ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {item.minimum_quantity}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {item.supplier}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {item.price_per_unit}€
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {item.last_order_date 
                    ? new Date(item.last_order_date).toLocaleDateString('fr-FR')
                    : '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <InventoryForm
          initialData={selectedItem}
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