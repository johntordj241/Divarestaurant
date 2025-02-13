```typescript
import { supabase } from '../supabase/client';
import { EmailTemplate, SMSTemplate } from '../../types/notifications';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendEmail(to: string, template: EmailTemplate, data: Record<string, any>) {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: { 
          to,
          template,
          data,
          from: 'La Diva Cabaret <no-reply@diva-restaurant.com>'
        }
      });

      if (error) throw error;

      await this.logNotification({
        type: 'email',
        recipient: to,
        template,
        status: 'sent'
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      await this.logNotification({
        type: 'email',
        recipient: to,
        template,
        status: 'failed',
        error: error.message
      });
      throw error;
    }
  }

  async sendSMS(to: string, template: SMSTemplate, data: Record<string, any>) {
    try {
      const { error } = await supabase.functions.invoke('send-sms', {
        body: { 
          to,
          template,
          data
        }
      });

      if (error) throw error;

      await this.logNotification({
        type: 'sms',
        recipient: to,
        template,
        status: 'sent'
      });
    } catch (error) {
      console.error('SMS sending failed:', error);
      await this.logNotification({
        type: 'sms',
        recipient: to,
        template,
        status: 'failed',
        error: error.message
      });
      throw error;
    }
  }

  async scheduleNotification(params: {
    type: 'email' | 'sms';
    recipient: string;
    template: EmailTemplate | SMSTemplate;
    data: Record<string, any>;
    scheduledFor: Date;
  }) {
    const { error } = await supabase
      .from('scheduled_notifications')
      .insert({
        type: params.type,
        recipient: params.recipient,
        template: params.template,
        data: params.data,
        scheduled_for: params.scheduledFor.toISOString(),
        status: 'pending'
      });

    if (error) throw error;
  }

  private async logNotification(data: {
    type: 'email' | 'sms';
    recipient: string;
    template: string;
    status: 'sent' | 'failed';
    error?: string;
  }) {
    const { error } = await supabase
      .from('notification_logs')
      .insert({
        ...data,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log notification:', error);
    }
  }
}
```