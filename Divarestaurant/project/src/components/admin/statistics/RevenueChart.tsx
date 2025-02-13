import React from 'react';
import { Euro, TrendingUp, TrendingDown } from 'lucide-react';

interface RevenueData {
  current: number;
  previous: number;
  trend: number;
}

interface RevenueChartProps {
  data: RevenueData;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const isTrendPositive = data.trend >= 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Euro className="text-gold" />
        <h3 className="text-lg font-medium">Évolution du chiffre d'affaires</h3>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Ce mois</p>
          <p className="text-3xl font-serif">{data.current.toLocaleString('fr-FR')}€</p>
        </div>

        <div className={`flex items-center gap-2 ${
          isTrendPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isTrendPositive ? (
            <TrendingUp size={24} />
          ) : (
            <TrendingDown size={24} />
          )}
          <span className="text-lg font-medium">{Math.abs(data.trend)}%</span>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Mois précédent</p>
          <p className="text-2xl text-gray-500">{data.previous.toLocaleString('fr-FR')}€</p>
        </div>
      </div>

      {/* Graphique de progression */}
      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold transition-all duration-1000 ease-in-out"
            style={{ width: `${(data.current / Math.max(data.current, data.previous)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}