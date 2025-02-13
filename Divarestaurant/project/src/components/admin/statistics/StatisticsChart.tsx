import React from 'react';
import { BarChart2 } from 'lucide-react';

interface ChartData {
  date: string;
  revenue: number;
  reservations: number;
}

interface StatisticsChartProps {
  data: ChartData[];
}

export function StatisticsChart({ data }: StatisticsChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxReservations = Math.max(...data.map(d => d.reservations));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="text-gold" />
        <h3 className="text-lg font-medium">Évolution des réservations et du CA</h3>
      </div>

      <div className="relative h-64">
        {data.map((item, index) => (
          <div 
            key={index}
            className="absolute bottom-0 flex items-end gap-2"
            style={{ 
              left: `${(index / (data.length - 1)) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {/* Barre du CA */}
            <div 
              className="w-3 bg-gold rounded-t"
              style={{ 
                height: `${(item.revenue / maxRevenue) * 100}%`,
                transition: 'height 0.3s ease-out'
              }}
            />
            
            {/* Barre des réservations */}
            <div 
              className="w-3 bg-gray-300 rounded-t"
              style={{ 
                height: `${(item.reservations / maxReservations) * 100}%`,
                transition: 'height 0.3s ease-out'
              }}
            />
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gold rounded" />
          <span>Chiffre d'affaires</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded" />
          <span>Réservations</span>
        </div>
      </div>
    </div>
  );
}