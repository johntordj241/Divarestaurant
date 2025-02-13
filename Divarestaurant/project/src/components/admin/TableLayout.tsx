import React from 'react';
import { Table } from 'lucide-react';

interface TableLayoutProps {
  reservations: any[];
  date: string;
}

export function TableLayout({ reservations, date }: TableLayoutProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-serif mb-6">Plan de salle - {new Date(date).toLocaleDateString('fr-FR')}</h3>
      
      <div className="grid grid-cols-3 gap-6">
        {['A', 'B', 'VIP'].map((section) => (
          <div key={section} className="space-y-4">
            <h4 className="font-medium">Section {section}</h4>
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((tableNumber) => {
                const tableId = `${section}${tableNumber}`;
                const reservation = reservations.find(r => r.tableId === tableId);
                
                return (
                  <div
                    key={tableId}
                    className={`p-4 rounded-lg border ${
                      reservation ? 'border-gold bg-gold/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Table className={reservation ? 'text-gold' : 'text-gray-400'} />
                      <div>
                        <p className="font-medium">Table {tableId}</p>
                        {reservation && (
                          <>
                            <p className="text-sm text-gray-600">{reservation.customerName}</p>
                            <p className="text-sm text-gray-600">{reservation.numberOfGuests} pers.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}