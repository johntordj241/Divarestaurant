import React from 'react';
import { QualityReport } from './QualityReport';
import { useQualityCheck } from '../../hooks/useQualityCheck';
import { RefreshCw } from 'lucide-react';

export function QualityDashboard() {
  const { report, isLoading, refresh } = useQualityCheck();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-gold">Contrôle Qualité</h1>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-admin-text-secondary">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Analyse en cours...
        </div>
      ) : report ? (
        <QualityReport report={report} />
      ) : (
        <div className="text-center py-12 text-red-500">
          Erreur lors du chargement du rapport
        </div>
      )}
    </div>
  );
}