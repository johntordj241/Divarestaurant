import React, { useState } from 'react';
import { Award, Gift, Users, Settings } from 'lucide-react';

interface LoyaltySettings {
  pointsPerEuro: number;
  onlineBookingBonus: number;
  reviewBonus: number;
  expirationEnabled: boolean;
  expirationMonths: number;
  notifyBeforeExpiration: boolean;
}

export function LoyaltyProgram() {
  const [settings, setSettings] = useState<LoyaltySettings>({
    pointsPerEuro: 1,
    onlineBookingBonus: 50,
    reviewBonus: 100,
    expirationEnabled: true,
    expirationMonths: 12,
    notifyBeforeExpiration: true
  });

  const handleSettingChange = (key: keyof LoyaltySettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gold">Programme de Fidélité</h2>
        <button className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors">
          Configurer les Récompenses
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-admin-card p-6 rounded-lg shadow-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-gold" />
            <div>
              <h3 className="text-lg font-medium text-white">Membres Actifs</h3>
              <p className="text-sm text-admin-text-secondary">Ce mois</p>
            </div>
          </div>
          <p className="text-3xl font-serif text-white">1,234</p>
        </div>

        <div className="bg-admin-card p-6 rounded-lg shadow-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="text-gold" />
            <div>
              <h3 className="text-lg font-medium text-white">Récompenses Utilisées</h3>
              <p className="text-sm text-admin-text-secondary">30 derniers jours</p>
            </div>
          </div>
          <p className="text-3xl font-serif text-white">89</p>
        </div>

        <div className="bg-admin-card p-6 rounded-lg shadow-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-gold" />
            <div>
              <h3 className="text-lg font-medium text-white">Points Distribués</h3>
              <p className="text-sm text-admin-text-secondary">Ce mois</p>
            </div>
          </div>
          <p className="text-3xl font-serif text-white">12,450</p>
        </div>
      </div>

      {/* Paramètres */}
      <div className="bg-admin-card p-6 rounded-lg shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-gold" />
          <h3 className="text-lg font-medium text-white">Paramètres du Programme</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-4">Attribution des Points</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-admin-text">Par euro dépensé</span>
                <input
                  type="number"
                  value={settings.pointsPerEuro}
                  onChange={(e) => handleSettingChange('pointsPerEuro', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-admin-text">Bonus réservation en ligne</span>
                <input
                  type="number"
                  value={settings.onlineBookingBonus}
                  onChange={(e) => handleSettingChange('onlineBookingBonus', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-admin-text">Bonus avis client</span>
                <input
                  type="number"
                  value={settings.reviewBonus}
                  onChange={(e) => handleSettingChange('reviewBonus', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Expiration des Points</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.expirationEnabled}
                  onChange={(e) => handleSettingChange('expirationEnabled', e.target.checked)}
                  className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
                />
                <span className="text-admin-text">Activer l'expiration des points</span>
              </label>
              <div className="flex justify-between items-center">
                <span className="text-admin-text">Durée de validité (mois)</span>
                <input
                  type="number"
                  value={settings.expirationMonths}
                  onChange={(e) => handleSettingChange('expirationMonths', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifyBeforeExpiration}
                  onChange={(e) => handleSettingChange('notifyBeforeExpiration', e.target.checked)}
                  className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
                />
                <span className="text-admin-text">Notifier avant expiration</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}