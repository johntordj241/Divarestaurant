import { MONITORING_CONFIG } from './config';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]>;
  private errors: Error[];
  
  private constructor() {
    this.metrics = new Map();
    this.errors = [];
  }
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  measurePageLoad(): void {
    if (window.performance) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.logMetric('pageLoadTime', pageLoadTime);

      if (pageLoadTime > MONITORING_CONFIG.THRESHOLDS.PAGE_LOAD) {
        this.logError(new Error(`Page load time exceeded threshold: ${pageLoadTime}ms`));
      }
    }
  }

  measureApiCall(endpoint: string, duration: number): void {
    this.logMetric(`api_${endpoint}`, duration);
    
    if (duration > MONITORING_CONFIG.THRESHOLDS.API_CALL) {
      this.logError(new Error(`API call exceeded threshold: ${endpoint} (${duration}ms)`));
    }
  }

  private logMetric(name: string, value: number): void {
    if (!MONITORING_CONFIG.MONITORING.ENABLED) return;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);

    if (MONITORING_CONFIG.MONITORING.LOG_LEVEL === 'debug') {
      console.debug(`[Performance] ${name}: ${value}ms`);
    }
  }

  private logError(error: Error): void {
    if (!MONITORING_CONFIG.MONITORING.ENABLED) return;

    // Vérifier si l'erreur doit être ignorée
    if (MONITORING_CONFIG.ERROR_TRACKING.IGNORE_PATTERNS.some(pattern => 
      error.message.includes(pattern)
    )) {
      return;
    }

    this.errors.push(error);
    
    // Limiter le nombre d'erreurs stockées
    if (this.errors.length > MONITORING_CONFIG.ERROR_TRACKING.MAX_ERRORS) {
      this.errors.shift();
    }

    console.warn('[Performance Error]', error);
  }

  getMetrics(): Record<string, { avg: number; min: number; max: number }> {
    const result: Record<string, { avg: number; min: number; max: number }> = {};
    
    this.metrics.forEach((values, key) => {
      if (values.length === 0) return;
      
      result[key] = {
        avg: values.reduce((a, b) => a + b) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    return result;
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.errors = [];
  }
}