import React from 'react';
import { ReservationStep } from '../../types/reservation';

interface StepsProps {
  steps: ReservationStep[];
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step.isActive
                ? 'bg-gold text-black'
                : step.isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {React.createElement(step.icon, { size: 20 })}
          </div>
          <span className="text-sm text-gray-600">{step.title}</span>
        </div>
      ))}
    </div>
  );
}