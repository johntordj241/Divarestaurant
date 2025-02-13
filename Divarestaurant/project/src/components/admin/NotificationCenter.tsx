import React from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'reservation', message: 'Nouvelle réservation pour ce soir', time: '10:30' },
  { id: 2, type: 'message', message: 'Message de contact reçu', time: '09:15' },
  { id: 3, type: 'system', message: 'Mise à jour système effectuée', time: '08:00' },
];

export function NotificationCenter() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Centre de notifications</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold/90 transition-colors">
            <Mail size={20} />
            Envoyer une notification
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <MessageSquare size={20} />
            Paramètres
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4">
            <Bell className="text-gold shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{notification.message}</p>
              <p className="text-sm text-gray-500">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}