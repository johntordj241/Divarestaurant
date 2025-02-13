import React from 'react';
import { TrendingUp, Clock, Database, Zap } from 'lucide-react';

interface MetricData {
  timestamp: string;
  value: number;
}

interface PerformanceMetric {
  name: string;
  current: number;
  history: MetricData[];
  unit: string;
  icon: React.ElementType;
  threshold: number;
}

export function PerformanceMetrics() {
  const [metrics] = React.useState<PerformanceMetric[]>([
    {
      name: 'Temps de réponse moyen',
      current: 120,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: Math.floor(Math.random() * 200 + 100)
      })),
      unit: 'ms',
      icon: Clock,
      threshold: 200
    },
    {
      name: 'Requêtes par seconde',
      current: 45,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: Math.floor(Math.random() * 50 + 20)
      })),
      unit: 'req/s',
      icon: TrendingUp,
      threshold: 100
    },
    {
      name: 'Temps de requête DB',
      current: 35,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: Math.floor(Math.random() * 50 + 20)
      })),
      unit: 'ms',
      icon: Database,
      threshold: 100
    },
    {
      name: 'Utilisation mémoire',
      current: 62,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: Math.floor(Math.random() * 30 + 50)
      })),
      unit: '%',
      icon: Zap,
      threshold: 80
    }
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-gold">Métriques de Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-admin-card p-6 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <metric.icon className="text-gold" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-white">{metric.name}</h3>
                  <p className="text-gray-400 text-sm">Dernières 24 heures</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif text-white">
                  {metric.current}
                  <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
                </p>
                <p className={`text-sm ${
                  metric.current > metric.threshold ? 'text-red-400' : 'text-green-400'
                }`}>
                  {metric.current > metric.threshold ? 'Au-dessus du seuil' : 'Normal'}
                </p>
              </div>
            </div>

            {/* Graphique */}
            <div className="h-32 relative">
              <div className="absolute inset-0 flex items-end">
                {metric.history.map((data, index) => {
                  const height = (data.value / Math.max(...metric.history.map(d => d.value))) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-gold/20 hover:bg-gold/30 transition-colors"
                      style={{ height: `${height}%` }}
                      title={`${data.value}${metric.unit} - ${new Date(data.timestamp).toLocaleTimeString()}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}