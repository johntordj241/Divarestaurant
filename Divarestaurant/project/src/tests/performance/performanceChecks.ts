import { PERFORMANCE_CONFIG } from '../../lib/performance/config';

export async function checkPageLoadTime(): Promise<{
  duration: number;
  isAcceptable: boolean;
}> {
  const timing = window.performance.timing;
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  
  return {
    duration: loadTime,
    isAcceptable: loadTime <= PERFORMANCE_CONFIG.THRESHOLDS.PAGE_LOAD
  };
}

export async function checkApiResponseTime(endpoint: string): Promise<{
  duration: number;
  isAcceptable: boolean;
}> {
  const start = performance.now();
  const response = await fetch(endpoint);
  const duration = performance.now() - start;

  return {
    duration,
    isAcceptable: duration <= PERFORMANCE_CONFIG.THRESHOLDS.API_CALL
  };
}

export async function checkImageLoadTime(imageUrl: string): Promise<{
  duration: number;
  isAcceptable: boolean;
}> {
  return new Promise((resolve) => {
    const start = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const duration = performance.now() - start;
      resolve({
        duration,
        isAcceptable: duration <= PERFORMANCE_CONFIG.THRESHOLDS.IMAGE_LOAD
      });
    };

    img.src = imageUrl;
  });
}

export function checkMemoryUsage(): {
  usage: number;
  isAcceptable: boolean;
} {
  const memory = (performance as any).memory;
  if (!memory) return { usage: 0, isAcceptable: true };

  const usageInMB = memory.usedJSHeapSize / (1024 * 1024);
  return {
    usage: usageInMB,
    isAcceptable: usageInMB <= PERFORMANCE_CONFIG.ALERTS.MEMORY_THRESHOLD
  };
}

export function checkResourceTiming(): {
  resources: PerformanceResourceTiming[];
  slowResources: string[];
} {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const slowResources = resources
    .filter(resource => resource.duration > PERFORMANCE_CONFIG.THRESHOLDS.API_CALL)
    .map(resource => resource.name);

  return { resources, slowResources };
}