import React from 'react';
import { Mail, Bell, Calendar, Settings } from 'lucide-react';

export function MarketingAutomation() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Automatisation Marketing</h2>
        <button className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors">
          Nouvelle Campagne
        </button>
      </div>

      {/* Campagnes actives */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-serif">Campagnes Actives</h3>
        </div>
        <div className="divide-y">
          {[
            {
              name: 'Rappel Réservation',
              type: 'email',
              status: 'active',
              stats: { sent: 1234, opened: 78, clicked: 45 }
            },
            {
              name: 'Offre Saint-Valentin',
              type: 'notification',
              status: 'scheduled',
              stats: { sent: 0, opened: 0, clicked: 0 }
            }
          ].map((campaign, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {campaign.type === 'email' ? (
                    <Mail className="text-gold" />
                  ) : (
                    <Bell className="text-gold" />
                  )}
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">Type: {campaign.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Envoyés</p>
                  <p className="font-medium">{campaign.stats.sent}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Ouverts</p>
                  <p className="font-medium">{campaign.stats.opened}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Cliqués</p>
                  <p className="font-medium">{campaign.stats.clicked}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automatisations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-gold" />
            <h3 className="text-lg font-medium">Emails Automatiques</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Confirmation de réservation</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Rappel 24h avant</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Demande d'avis post-visite</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-gold" />
            <h3 className="text-lg font-medium">Planification</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Posts réseaux sociaux</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Newsletters hebdomadaires</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Promotions automatiques</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-gold" />
            <h3 className="text-lg font-medium">Paramètres</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Segmentation automatique</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Tracking analytics</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span>Rapports automatiques</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}