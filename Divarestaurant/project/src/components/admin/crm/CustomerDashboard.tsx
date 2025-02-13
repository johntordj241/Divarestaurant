import React from 'react';
import { useCRM } from '../../../hooks/useCRM';
import { User, Star, MessageSquare, Calendar } from 'lucide-react';

export function CustomerDashboard() {
  const { customers, isLoading } = useCRM();

  if (isLoading) {
    return <div>Chargement des données clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestion des Clients</h2>
        <button className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors">
          Exporter les données
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistiques */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-gold" />
            <h3 className="text-lg font-medium">Clients Actifs</h3>
          </div>
          <p className="text-3xl font-serif">1,234</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-gold" />
            <h3 className="text-lg font-medium">Note Moyenne</h3>
          </div>
          <p className="text-3xl font-serif">4.8/5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-gold" />
            <h3 className="text-lg font-medium">Réservations du Mois</h3>
          </div>
          <p className="text-3xl font-serif">342</p>
        </div>
      </div>

      {/* Liste des derniers clients */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-serif">Derniers Clients</h3>
        </div>
        <div className="divide-y">
          {customers?.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{customer.name}</h4>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <MessageSquare size={20} />
                  </button>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {customer.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>Dernière visite: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                <span>Points fidélité: {customer.loyaltyPoints}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}