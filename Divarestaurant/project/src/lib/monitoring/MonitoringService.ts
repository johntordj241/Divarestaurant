import { MONITORING_CONFIG } from './config';

export class MonitoringService {
  private static instance: MonitoringService;
  private environment: 'development' | 'staging' | 'production';

  private constructor() {
    this.environment = import.meta.env.MODE as 'development' | 'staging' | 'production';
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  logError(error: Error, context?: Record<string, any>) {
    const config = MONITORING_CONFIG.ENVIRONMENTS[this.environment];
    
    if (config.ENABLE_DEBUG) {
      console.error('Error:', error);
      if (context) console.error('Context:', context);
    }

    if (import.meta.env.VITE_SENTRY_DSN) {
      // Envoyer à Sentry
      this.sendToSentry(error, context);
    }
  }

  logInfo(message: string, data?: Record<string, any>) {
    const config = MONITORING_CONFIG.ENVIRONMENTS[this.environment];
    
    if (config.LOG_LEVEL === 'debug' || config.LOG_LEVEL === 'info') {
      console.info(message, data);
    }
  }

  trackEvent(name: string, properties?: Record<string, any>) {
    if (MONITORING_CONFIG.ANALYTICS.ENABLED) {
      // Envoyer à Google Analytics ou autre
      this.sendToAnalytics(name, properties);
    }
  }

  private sendToSentry(error: Error, context?: Record<string, any>) {
    // Implémentation de l'envoi à Sentry
  }

  private sendToAnalytics(name: string, properties?: Record<string, any>) {
    // Implémentation de l'envoi aux analytics
  }
}