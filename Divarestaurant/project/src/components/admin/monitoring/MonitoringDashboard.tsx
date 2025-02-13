import React from 'react';
import { Activity, Server, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PerformanceMonitor } from '../../../lib/performance/monitor';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: string;
}

export function MonitoringDashboard() {
  const [services, setServices] = React.useState<ServiceStatus[]>([
    {
      name: 'API',
      status: 'healthy',
      responseTime: 120,
      uptime: 99.99,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Base de données',
      status: 'healthy',
      responseTime: 85,
      uptime: 99.95,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Stockage',
      status: 'healthy',
      responseTime: 95,
      uptime: 99.98,
      lastCheck: new Date().toISOString()
    }
  ]);

  const [metrics, setMetrics] = React.useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 28
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="text-yellow-500" />;
      case 'down':
        return <XCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gold">Monitoring</h2>
        <div className="flex items-center gap-2">
          <Activity className="text-gold" />
          <span className="text-white">Mise à jour en temps réel</span>
        </div>
      </div>

      {/* Statut des services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.name} className="bg-admin-card p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{service.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(service.status)}
                  <span className={`${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
              </div>
              <Server className="text-gold" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Temps de réponse</span>
                <span className="text-white">{service.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Uptime</span>
                <span className="text-white">{service.uptime}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Dernier check</span>
                <span className="text-white">{new Date(service.lastCheck).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Métriques système */}
      <div className="bg-admin-card p-6 rounded-lg border border-white/10">
        <h3 className="text-lg font-medium text-white mb-6">Métriques système</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">{key}</span>
                <span className="text-white">{value}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des incidents */}
      <div className="bg-admin-card p-6 rounded-lg border border-white/10">
        <h3 className="text-lg font-medium text-white mb-6">Historique des incidents</h3>
        <div className="space-y-4">
          {[
            {
              date: '2024-01-24 15:30',
              service: 'API',
              description: 'Latence élevée détectée',
              status: 'resolved'
            },
            {
              date: '2024-01-23 10:15',
              service: 'Base de données',
              description: 'Pic de charge CPU',
              status: 'resolved'
            }
          ].map((incident, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <Clock className="text-gold shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{incident.service}</p>
                    <p className="text-gray-400">{incident.description}</p>
                  </div>
                  <span className="text-sm text-gray-400">{incident.date}</span>
                </div>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  {incident.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}