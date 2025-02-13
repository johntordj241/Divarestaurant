import React, { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';

interface InventoryFormProps {
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function InventoryForm({ initialData, onClose, onSubmit }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || '',
    minimum_quantity: initialData?.minimum_quantity || 0,
    category: initialData?.category || '',
    supplier: initialData?.supplier || '',
    price_per_unit: initialData?.price_per_unit || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif">
            {initialData ? 'Modifier le produit' : 'Nouveau produit'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité en stock
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unité
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                placeholder="kg, L, unité..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil minimum
              </label>
              <input
                type="number"
                value={formData.minimum_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, minimum_quantity: Number(e.target.value) }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_per_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: Number(e.target.value) }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
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