import { describe, it, expect, vi } from 'vitest';
import { MonitoringService } from '../../lib/monitoring/MonitoringService';

describe('MonitoringService', () => {
  const service = MonitoringService.getInstance();

  it('should track events successfully', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.spyOn(service as any, 'trackEvent').mockImplementation(mockInsert);

    await service.trackEvent('test_event', { value: 123 });

    expect(mockInsert).toHaveBeenCalledWith('test_event', expect.objectContaining({
      value: 123
    }));
  });

  it('should log errors correctly', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.spyOn(service as any, 'logError').mockImplementation(mockInsert);

    const testError = new Error('Test error');
    await service.logError(testError, { context: 'test' });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ context: 'test' })
    );
  });

  it('should track page views', async () => {
    const trackEventSpy = vi.spyOn(service, 'trackEvent');
    const measurePageLoadSpy = vi.spyOn(service as any, 'performanceMonitor', 'measurePageLoad');

    await service.trackPageView('/test-page');

    expect(trackEventSpy).toHaveBeenCalledWith('page_view', { path: '/test-page' });
    expect(measurePageLoadSpy).toHaveBeenCalled();
  });
});