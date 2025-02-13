import { useState, useCallback } from 'react';
import { AutomationService } from '../lib/automation/AutomationService';
import { AnalyticsService } from '../lib/automation/AnalyticsService';
import { NotificationService } from '../lib/automation/NotificationService';

export function useAutomation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runAutomation = useCallback(async (type: 'analytics' | 'notifications' | 'reminders') => {
    setIsProcessing(true);
    setError(null);

    try {
      switch (type) {
        case 'analytics':
          const analyticsService = new AnalyticsService();
          return await analyticsService.generateDailyReport();

        case 'notifications':
          const notificationService = NotificationService.getInstance();
          // Get pending notifications and process them
          const pendingReservations = await getPendingReservations();
          for (const reservation of pendingReservations) {
            await notificationService.sendReservationReminder(reservation);
          }
          break;

        case 'reminders':
          const automationService = AutomationService.getInstance();
          await automationService.scheduleReservationReminders();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Automation failed'));
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    runAutomation,
    isProcessing,
    error
  };
}

async function getPendingReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('status', 'pending')
    .gte('date', new Date().toISOString());

  if (error) throw error;
  return data;
}