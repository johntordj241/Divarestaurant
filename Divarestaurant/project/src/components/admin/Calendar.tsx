import React from 'react';
import { useReservations } from '../../hooks/useReservations';
import { formatDate } from '../../utils/date';

export function Calendar() {
  const { reservations } = useReservations();
  const today = new Date();
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-serif mb-4">Planning de la semaine</h2>
      
      <div className="grid grid-cols-7 gap-4">
        {days.map((date) => {
          const dayReservations = reservations.filter(
            (r) => new Date(r.date).toDateString() === date.toDateString()
          );

          return (
            <div 
              key={date.toISOString()} 
              className="text-center"
            >
              <p className="font-medium">{formatDate(date, 'weekday')}</p>
              <p className="text-sm text-gray-600">{formatDate(date, 'day')}</p>
              
              <div className="mt-2">
                <span className="text-lg font-serif">
                  {dayReservations.length}
                </span>
                <span className="text-sm text-gray-600"> résa</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}