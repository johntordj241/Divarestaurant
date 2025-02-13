import { supabase } from '../supabase/client';

export class NotificationService {
  private static instance: NotificationService;
  private subscription: any;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async subscribeToNotifications(userId: string, onNotification: (notification: any) => void) {
    // Se désabonner des anciennes souscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // S'abonner aux nouvelles notifications
    this.subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new);
        }
      )
      .subscribe();
  }

  async unsubscribeFromNotifications() {
    if (this.subscription) {
      await this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  async sendNotification(userId: string, type: string, message: string, data?: any) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        data,
        read: false,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  async getUnreadNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}