import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface TimeSlot {
  time: string;
  count: number;
  percentage: number;
}

interface ReservationTrendsProps {
  popularTimes: TimeSlot[];
  popularDays: {
    day: string;
    count: number;
    percentage: number;
  }[];
}

export function ReservationTrends({ popularTimes, popularDays }: ReservationTrendsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-6">Tendances des réservations</h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Horaires populaires */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-gold" />
            <h4 className="font-medium">Horaires les plus demandés</h4>
          </div>

          <div className="space-y-3">
            {popularTimes.map((slot, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{slot.time}</span>
                  <span>{slot.count} réservations</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jours populaires */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-gold" />
            <h4 className="font-medium">Jours les plus fréquentés</h4>
          </div>

          <div className="space-y-3">
            {popularDays.map((day, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{day.day}</span>
                  <span>{day.count} réservations</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold"
                    style={{ width: `${day.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}