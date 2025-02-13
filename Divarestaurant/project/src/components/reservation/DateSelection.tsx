import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { ShowTime } from '../../types';

interface DateSelectionProps {
  date: string;
  time: string;
  guests: number;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onGuestsChange: (guests: number) => void;
}

const AVAILABLE_TIMES: ShowTime[] = [
  { id: '1', date: '2024-03-20', time: '19:30', availableSeats: 45, price: 85 },
  { id: '2', date: '2024-03-20', time: '21:30', availableSeats: 30, price: 85 },
  { id: '3', date: '2024-03-21', time: '19:30', availableSeats: 50, price: 85, isSpecialEvent: true, specialEventName: 'Soirée Jazz' }
];

export function DateSelection({ 
  date, 
  time, 
  guests, 
  onDateChange, 
  onTimeChange, 
  onGuestsChange 
}: DateSelectionProps) {
  const availableTimes = AVAILABLE_TIMES.filter(t => t.date === date);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {date && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horaire
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-md appearance-none"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
            >
              <option value="">Sélectionnez un horaire</option>
              {availableTimes.map((t) => (
                <option key={t.id} value={t.time}>
                  {t.time} {t.isSpecialEvent && `- ${t.specialEventName}`}
                  {` (${t.availableSeats} places)`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre d'invités
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="number"
            min="1"
            max="20"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={guests}
            onChange={(e) => onGuestsChange(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}