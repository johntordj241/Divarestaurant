import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Tag, Plus } from 'lucide-react';
import { MediaSelector } from './MediaSelector';

interface MenuFormProps {
  initialData?: any;
  categories: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function MenuForm({ initialData, categories, onClose, onSubmit }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category_id: initialData?.category_id || '',
    image_url: initialData?.image_url || '',
    is_vegetarian: initialData?.is_vegetarian || false,
    is_gluten_free: initialData?.is_gluten_free || false,
    allergens: initialData?.allergens || [],
    available: initialData?.available ?? true
  });
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [newAllergen, setNewAllergen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  const handleMediaSelect = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    setShowMediaSelector(false);
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif">
            {initialData ? 'Modifier le plat' : 'Nouveau plat'}
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
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="flex gap-4 items-start">
                {formData.image_url ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.image_url}
                      alt={formData.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaSelector(true)}
                    className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gold transition-colors"
                  >
                    <ImageIcon size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Ajouter une image</span>
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergènes
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.allergens.map(allergen => (
                  <span
                    key={allergen}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {allergen}
                    <button
                      type="button"
                      onClick={() => removeAllergen(allergen)}
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
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                  placeholder="Ajouter un allergène"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addAllergen}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_vegetarian}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_vegetarian: e.target.checked }))}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span>Plat végétarien</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_gluten_free}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_gluten_free: e.target.checked }))}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span>Sans gluten</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span>Disponible</span>
              </label>
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

      {showMediaSelector && (
        <MediaSelector
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </div>
  );
}