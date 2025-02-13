import React from 'react';
import { Bell, AlertTriangle, Settings, Save } from 'lucide-react';

interface AlertConfig {
  type: string;
  threshold: number;
  enabled: boolean;
  notification: {
    email: boolean;
    slack: boolean;
    sms: boolean;
  };
}

export function AlertsConfig() {
  const [configs, setConfigs] = React.useState<AlertConfig[]>([
    {
      type: 'response_time',
      threshold: 200,
      enabled: true,
      notification: {
        email: true,
        slack: true,
        sms: false
      }
    },
    {
      type: 'error_rate',
      threshold: 5,
      enabled: true,
      notification: {
        email: true,
        slack: true,
        sms: true
      }
    },
    {
      type: 'memory_usage',
      threshold: 80,
      enabled: true,
      notification: {
        email: true,
        slack: false,
        sms: false
      }
    }
  ]);

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'response_time':
        return 'Temps de réponse (ms)';
      case 'error_rate':
        return "Taux d'erreur (%)";
      case 'memory_usage':
        return 'Utilisation mémoire (%)';
      default:
        return type;
    }
  };

  const handleConfigChange = (index: number, field: string, value: any) => {
    const newConfigs = [...configs];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      (newConfigs[index] as any)[parent][child] = value;
    } else {
      (newConfigs[index] as any)[field] = value;
    }
    setConfigs(newConfigs);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gold">Configuration des Alertes</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90">
          <Save size={20} />
          Sauvegarder
        </button>
      </div>

      <div className="space-y-6">
        {configs.map((config, index) => (
          <div key={index} className="bg-admin-card p-6 rounded-lg border border-white/10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-gold" />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {getAlertTypeLabel(config.type)}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Alerte quand le seuil est dépassé
                  </p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => handleConfigChange(index, 'enabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-14 h-7 transition-colors rounded-full ${
                  config.enabled ? 'bg-gold' : 'bg-gray-600'
                }`}>
                  <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.enabled ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seuil d'alerte
                </label>
                <input
                  type="number"
                  value={config.threshold}
                  onChange={(e) => handleConfigChange(index, 'threshold', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.notification.email}
                      onChange={(e) => handleConfigChange(index, 'notification.email', e.target.checked)}
                      className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
                    />
                    <span className="text-white">Email</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.notification.slack}
                      onChange={(e) => handleConfigChange(index, 'notification.slack', e.target.checked)}
                      className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
                    />
                    <span className="text-white">Slack</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.notification.sms}
                      onChange={(e) => handleConfigChange(index, 'notification.sms', e.target.checked)}
                      className="rounded border-gray-600 text-gold focus:ring-gold bg-gray-700"
                    />
                    <span className="text-white">SMS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}