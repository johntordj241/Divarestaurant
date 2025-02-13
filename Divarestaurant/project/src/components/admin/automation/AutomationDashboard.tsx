import React from 'react';
import { useAutomation } from '../../../hooks/useAutomation';
import { Bell, Share2, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';

export function AutomationDashboard() {
  const { runAutomation, isProcessing, error } = useAutomation();

  const automationTasks = [
    {
      id: 'reminders',
      title: 'Rappels de réservation',
      description: 'Planifier les rappels automatiques',
      icon: Bell,
      action: () => runAutomation('reminders')
    },
    {
      id: 'social',
      title: 'Réseaux sociaux',
      description: 'Synchroniser le contenu',
      icon: Share2,
      action: () => runAutomation('social')
    },
    {
      id: 'analytics',
      title: 'Rapport analytique',
      description: 'Générer le rapport mensuel',
      icon: BarChart3,
      action: () => runAutomation('analytics')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gold">Automatisations</h2>
        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            <span>{error.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {automationTasks.map((task) => (
          <div
            key={task.id}
            className="bg-admin-card rounded-lg shadow-lg p-6 border border-white/10"
          >
            <div className="flex items-start justify-between mb-4">
              <task.icon className="text-gold" size={24} />
              <button
                onClick={task.action}
                disabled={isProcessing}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <RefreshCw 
                  size={20} 
                  className={`text-white/70 hover:text-white ${isProcessing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-2">{task.title}</h3>
            <p className="text-admin-text-secondary">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}