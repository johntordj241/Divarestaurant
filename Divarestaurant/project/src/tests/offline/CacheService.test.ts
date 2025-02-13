```typescript
import { describe, it, expect, vi } from 'vitest';
import { CacheService } from '../../lib/offline/CacheService';

describe('CacheService', () => {
  const service = CacheService.getInstance();

  beforeEach(async () => {
    await service.clear();
  });

  it('should store and retrieve data', async () => {
    const testData = { id: 1, name: 'Test' };
    await service.set('test-key', testData);
    
    const retrieved = await service.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('should handle cache expiration', async () => {
    const testData = { id: 1, name: 'Test' };
    await service.set('test-key', testData);

    // Mock time to advance past TTL
    vi.advanceTimersByTime(3600001);

    const retrieved = await service.get('test-key');
    expect(retrieved).toBeNull();
  });

  it('should remove items correctly', async () => {
    await service.set('test-key', { data: 'test' });
    await service.remove('test-key');
    
    const retrieved = await service.get('test-key');
    expect(retrieved).toBeNull();
  });

  it('should check if key exists', async () => {
    await service.set('test-key', { data: 'test' });
    
    expect(await service.has('test-key')).toBe(true);
    expect(await service.has('non-existent')).toBe(false);
  });
});
```