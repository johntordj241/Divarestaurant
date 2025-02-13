import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationService } from '../lib/notifications/NotificationService';
import { useAuth } from '../hooks/useAuth';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    if (!user) return;

    // Charger les notifications non lues
    loadUnreadNotifications();

    // S'abonner aux nouvelles notifications
    notificationService.subscribeToNotifications(user.id, (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      notificationService.unsubscribeFromNotifications();
    };
  }, [user]);

  const loadUnreadNotifications = async () => {
    if (!user) return;
    const unreadNotifications = await notificationService.getUnreadNotifications(user.id);
    setNotifications(unreadNotifications);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-black border border-gray-800 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white">{notification.message}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(notification.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Marquer comme lu
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}