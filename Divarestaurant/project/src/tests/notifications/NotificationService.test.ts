```typescript
import { describe, it, expect, vi } from 'vitest';
import { NotificationService } from '../../lib/notifications/NotificationService.prod';

describe('NotificationService', () => {
  const service = NotificationService.getInstance();

  it('should send email successfully', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ error: null });
    vi.spyOn(service as any, 'logNotification').mockResolvedValue(null);

    await service.sendEmail(
      'test@example.com',
      'reservation_confirmation',
      { name: 'Test User', date: '2024-03-01' }
    );

    expect(mockInvoke).toHaveBeenCalledWith('send-email', {
      body: expect.objectContaining({
        to: 'test@example.com',
        template: 'reservation_confirmation'
      })
    });
  });

  it('should send SMS successfully', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ error: null });
    vi.spyOn(service as any, 'logNotification').mockResolvedValue(null);

    await service.sendSMS(
      '+33612345678',
      'reservation_reminder',
      { name: 'Test User', time: '19:00' }
    );

    expect(mockInvoke).toHaveBeenCalledWith('send-sms', {
      body: expect.objectContaining({
        to: '+33612345678',
        template: 'reservation_reminder'
      })
    });
  });

  it('should schedule notification successfully', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    await service.scheduleNotification({
      type: 'email',
      recipient: 'test@example.com',
      template: 'reservation_confirmation',
      data: { name: 'Test User' },
      scheduledFor: new Date('2024-03-01T19:00:00')
    });

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      type: 'email',
      recipient: 'test@example.com',
      status: 'pending'
    }));
  });
});
```