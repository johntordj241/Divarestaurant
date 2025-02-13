import React, { useState } from 'react';
import { Settings, Bell, RefreshCw, Calendar, Instagram } from 'lucide-react';

interface AutomationConfig {
  notifications: {
    email: boolean;
    sms: boolean;
    slack: boolean;
  };
  social: {
    instagram: boolean;
    facebook: boolean;
  };
  calendar: {
    googleSync: boolean;
    outlookSync: boolean;
  };
}

export function AutomationSettings() {
  const [config, setConfig] = useState<AutomationConfig>({
    notifications: {
      email: true,
      sms: true,
      slack: false,
    },
    social: {
      instagram: true,
      facebook: false,
    },
    calendar: {
      googleSync: true,
      outlookSync: false,
    },
  });

  const updateConfig = (section: keyof AutomationConfig, key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      }
    }));
  };

  return (
    <div className="bg-admin-card rounded-lg shadow-lg p-6 border border-white/10">
      <h2 className="text-2xl font-serif mb-6 flex items-center gap-2 text-gold">
        <Settings className="text-gold" />
        Paramètres d'automatisation
      </h2>

      <div className="space-y-8">
        {/* Notifications */}
        <section>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
            <Bell className="text-gold" />
            Notifications automatiques
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.notifications.email}
                onChange={(e) => updateConfig('notifications', 'email', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>Emails de confirmation</span>
            </label>
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.notifications.sms}
                onChange={(e) => updateConfig('notifications', 'sms', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>SMS de rappel</span>
            </label>
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.notifications.slack}
                onChange={(e) => updateConfig('notifications', 'slack', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>Notifications Slack pour l'équipe</span>
            </label>
          </div>
        </section>

        {/* Synchronisation calendrier */}
        <section>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
            <Calendar className="text-gold" />
            Synchronisation calendrier
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.calendar.googleSync}
                onChange={(e) => updateConfig('calendar', 'googleSync', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>Google Calendar</span>
            </label>
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.calendar.outlookSync}
                onChange={(e) => updateConfig('calendar', 'outlookSync', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>Outlook Calendar</span>
            </label>
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
            <Instagram className="text-gold" />
            Publication automatique
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.social.instagram}
                onChange={(e) => updateConfig('social', 'instagram', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>Instagram</span>
            </label>
            <label className="flex items-center gap-3 text-admin-text">
              <input
                type="checkbox"
                checked={config.social.facebook}
                onChange={(e) => updateConfig('social', 'facebook', e.target.checked)}
                className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
              />
              <span>Facebook</span>
            </label>
          </div>
        </section>

        <div className="pt-6 border-t border-white/10">
          <button
            className="w-full bg-gold text-black py-3 rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Mettre à jour les automatisations
          </button>
        </div>
      </div>
    </div>
  );
}