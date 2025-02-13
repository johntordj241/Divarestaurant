import { MONITORING_CONFIG } from './config';
import { MonitoringService } from './MonitoringService';

export class HealthCheck {
  private static instance: HealthCheck;
  private monitoringService: MonitoringService;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.monitoringService = MonitoringService.getInstance();
  }

  static getInstance(): HealthCheck {
    if (!HealthCheck.instance) {
      HealthCheck.instance = new HealthCheck();
    }
    return HealthCheck.instance;
  }

  startMonitoring() {
    if (!MONITORING_CONFIG.HEALTH_CHECK.ENABLED) return;

    this.checkInterval = setInterval(
      () => this.checkEndpoints(),
      MONITORING_CONFIG.HEALTH_CHECK.INTERVAL
    );
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkEndpoints() {
    for (const endpoint of MONITORING_CONFIG.HEALTH_CHECK.ENDPOINTS) {
      try {
        const startTime = performance.now();
        const response = await fetch(endpoint, {
          signal: AbortSignal.timeout(MONITORING_CONFIG.HEALTH_CHECK.TIMEOUT)
        });

        const duration = performance.now() - startTime;
        const isHealthy = response.ok;

        await this.monitoringService.trackHealthCheck({
          endpoint,
          duration,
          status: response.status,
          isHealthy
        });

        if (!isHealthy || duration > MONITORING_CONFIG.ALERTS.RESPONSE_TIME_THRESHOLD) {
          await this.monitoringService.triggerAlert({
            type: 'health_check',
            severity: 'high',
            message: `Health check failed for ${endpoint}`,
            details: {
              status: response.status,
              duration,
              threshold: MONITORING_CONFIG.ALERTS.RESPONSE_TIME_THRESHOLD
            }
          });
        }
      } catch (error) {
        await this.monitoringService.logError(error as Error, {
          context: 'health_check',
          endpoint
        });
      }
    }
  }
}