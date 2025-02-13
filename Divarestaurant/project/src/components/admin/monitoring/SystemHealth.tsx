import React from 'react';
import { Shield, Database, Server, Cloud } from 'lucide-react';

interface HealthCheck {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  lastCheck: string;
  metrics: {
    uptime: number;
    latency: number;
    errorRate: number;
  };
}

export function SystemHealth() {
  const [healthChecks] = React.useState<HealthCheck[]>([
    {
      component: 'Base de données',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      metrics: {
        uptime: 99.99,
        latency: 45,
        errorRate: 0.01
      }
    },
    {
      component: 'Serveur API',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      metrics: {
        uptime: 99.95,
        latency: 120,
        errorRate: 0.05
      }
    },
    {
      component: 'Stockage',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      metrics: {
        uptime: 99.98,
        latency: 85,
        errorRate: 0.02
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (component: string) => {
    switch (component) {
      case 'Base de données':
        return Database;
      case 'Serveur API':
        return Server;
      case 'Stockage':
        return Cloud;
      default:
        return Shield;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-gold">Santé du Système</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {healthChecks.map((check) => {
          const Icon = getStatusIcon(check.component);
          return (
            <div key={check.component} className="bg-admin-card p-6 rounded-lg border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="text-gold" size={24} />
                  <div>
                    <h3 className="text-lg font-medium text-white">{check.component}</h3>
                    <span className={`text-sm ${getStatusColor(check.status)}`}>
                      {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">{check.metrics.uptime}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Latence</span>
                  <span className="text-white">{check.metrics.latency}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taux d'erreur</span>
                  <span className="text-white">{check.metrics.errorRate}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Dernière vérification: {new Date(check.lastCheck).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}