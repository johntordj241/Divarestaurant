import React from 'react';
import { Users } from 'lucide-react';

interface OccupancyData {
  percentage: number;
  totalSeats: number;
  reservedSeats: number;
}

interface OccupancyChartProps {
  data: OccupancyData;
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-gold" />
        <h3 className="text-lg font-medium">Taux d'occupation</h3>
      </div>

      <div className="flex flex-col items-center">
        {/* Jauge circulaire */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Cercle de fond */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            {/* Cercle de progression */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - data.percentage / 100)}`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-in-out"
            />
            {/* Pourcentage au centre */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy="0.3em"
              className="text-3xl font-serif"
              fill="#111827"
            >
              {Math.round(data.percentage)}%
            </text>
          </svg>
        </div>

        {/* Détails */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {data.reservedSeats} places réservées sur {data.totalSeats} disponibles
          </p>
        </div>

        {/* Légende des couleurs */}
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gold rounded-full" />
            <span>Occupé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <span>Disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}