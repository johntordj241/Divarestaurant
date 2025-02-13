```typescript
import { describe, it, expect, vi } from 'vitest';
import { PerformanceMonitor } from '../../lib/performance/monitor';

describe('Performance Metrics', () => {
  it('should measure page load time correctly', () => {
    const monitor = PerformanceMonitor.getInstance();
    const logMetricSpy = vi.spyOn(monitor as any, 'logMetric');

    monitor.measurePageLoad();

    expect(logMetricSpy).toHaveBeenCalledWith(
      'pageLoadTime',
      expect.any(Number)
    );
  });

  it('should detect slow API calls', () => {
    const monitor = PerformanceMonitor.getInstance();
    const reportSlowQuerySpy = vi.spyOn(monitor as any, 'reportSlowQuery');

    monitor.measureApiCall('/api/reservations', 2000); // Slow call

    expect(reportSlowQuerySpy).toHaveBeenCalledWith(
      '/api/reservations',
      2000
    );
  });

  it('should not report fast API calls as slow', () => {
    const monitor = PerformanceMonitor.getInstance();
    const reportSlowQuerySpy = vi.spyOn(monitor as any, 'reportSlowQuery');

    monitor.measureApiCall('/api/menu', 100); // Fast call

    expect(reportSlowQuerySpy).not.toHaveBeenCalled();
  });
});
```