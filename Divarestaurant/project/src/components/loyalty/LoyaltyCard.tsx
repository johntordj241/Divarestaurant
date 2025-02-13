import React from 'react';
import { Star, Gift, TrendingUp } from 'lucide-react';

interface LoyaltyCardProps {
  data: {
    points: number;
    tier: string;
    nextTierPoints: number;
    history: {
      date: string;
      points: number;
      reason: string;
    }[];
  };
}

export function LoyaltyCard({ data }: LoyaltyCardProps) {
  const progress = (data.points / data.nextTierPoints) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-serif mb-2">Carte de Fidélité</h3>
          <div className="flex items-center gap-2">
            <Star className="text-gold" size={20} />
            <span className="text-gray-600">{data.tier}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-serif">{data.points}</p>
          <p className="text-sm text-gray-600">points</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progression</span>
          <span>{data.nextTierPoints - data.points} points jusqu'au prochain niveau</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Gift className="text-gold" size={20} />
          Historique des points
        </h4>
        {data.history.map((transaction, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">{transaction.reason}</p>
              <p className="text-sm text-gray-600">
                {new Date(transaction.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp size={16} />
              <span>+{transaction.points}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}