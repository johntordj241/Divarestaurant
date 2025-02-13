export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly TTL = 3600000; // 1 hour in milliseconds

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  async set(key: string, data: any): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async remove(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }
}