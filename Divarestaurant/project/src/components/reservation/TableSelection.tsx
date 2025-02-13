import React from 'react';
import { Table } from 'lucide-react';

interface TableSelectionProps {
  selectedTable: string | null;
  onTableSelect: (tableId: string) => void;
  numberOfGuests: number;
}

const TABLES = [
  { id: 'A1', capacity: 4, position: 'Près de la scène' },
  { id: 'A2', capacity: 4, position: 'Près de la scène' },
  { id: 'B1', capacity: 6, position: 'Vue centrale' },
  { id: 'B2', capacity: 6, position: 'Vue centrale' },
  { id: 'VIP1', capacity: 8, position: 'Section VIP' },
];

export function TableSelection({ selectedTable, onTableSelect, numberOfGuests }: TableSelectionProps) {
  const availableTables = TABLES.filter(table => table.capacity >= numberOfGuests);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif mb-4">Choisissez votre emplacement</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {availableTables.map((table) => (
          <button
            key={table.id}
            onClick={() => onTableSelect(table.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTable === table.id
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <Table className={selectedTable === table.id ? 'text-gold' : 'text-gray-400'} />
              <div>
                <p className="font-medium">Table {table.id}</p>
                <p className="text-sm text-gray-600">{table.position}</p>
                <p className="text-sm text-gray-600">Jusqu'à {table.capacity} personnes</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}