import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface AutomationLog {
  id: string;
  type: 'reminder' | 'social' | 'analytics';
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export function AutomationLogs() {
  const [logs] = React.useState<AutomationLog[]>([
    {
      id: '1',
      type: 'reminder',
      status: 'success',
      message: 'Rappels envoyés avec succès',
      timestamp: new Date().toISOString()
    }
  ]);

  return (
    <div className="bg-admin-card rounded-lg shadow-lg p-6 border border-white/10">
      <h3 className="text-xl font-serif mb-6 text-gold">Historique des automatisations</h3>
      
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-4 rounded-lg bg-white/5"
          >
            {log.status === 'success' ? (
              <CheckCircle className="text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="text-red-500 shrink-0" />
            )}
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-medium text-white">{log.message}</p>
                <div className="flex items-center gap-1 text-sm text-admin-text-secondary">
                  <Clock size={14} />
                  <span>
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}