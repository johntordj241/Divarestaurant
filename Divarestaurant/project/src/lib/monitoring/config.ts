export const MONITORING_CONFIG = {
  ENVIRONMENTS: {
    development: {
      LOG_LEVEL: 'debug',
      ENABLE_SOURCEMAPS: true,
      ENABLE_HOT_RELOAD: true,
      ENABLE_DEBUG: true
    },
    staging: {
      LOG_LEVEL: 'info',
      ENABLE_SOURCEMAPS: true,
      ENABLE_HOT_RELOAD: false,
      ENABLE_DEBUG: true
    },
    production: {
      LOG_LEVEL: 'error',
      ENABLE_SOURCEMAPS: false,
      ENABLE_HOT_RELOAD: false,
      ENABLE_DEBUG: false
    }
  },
  SENTRY: {
    DSN: import.meta.env.VITE_SENTRY_DSN,
    ENVIRONMENT: import.meta.env.MODE,
    TRACES_SAMPLE_RATE: 0.2,
    REPLAYS_SESSION_SAMPLE_RATE: 0.1,
    REPLAYS_ON_ERROR_SAMPLE_RATE: 1.0,
  },
  ANALYTICS: {
    ID: import.meta.env.VITE_ANALYTICS_ID,
    ENABLED: true,
    TRACK_PAGEVIEWS: true,
    TRACK_ERRORS: true,
    TRACK_PERFORMANCE: true,
  }
};