export const PERFORMANCE_CONFIG = {
  // Seuils de performance
  THRESHOLDS: {
    PAGE_LOAD: 3000, // 3 secondes max pour le chargement de page
    API_CALL: 1000,  // 1 seconde max pour les appels API
    IMAGE_LOAD: 2000 // 2 secondes max pour le chargement des images
  },

  // Configuration du monitoring
  MONITORING: {
    ENABLED: true,
    LOG_LEVEL: 'warn',
    SAMPLE_RATE: 0.1 // 10% des requêtes sont monitorées
  },

  // Configuration du cache
  CACHE: {
    TTL: 3600,        // 1 heure en secondes
    MAX_ENTRIES: 100, // Nombre maximum d'entrées en cache
    VERSION: '1.0'    // Version du cache pour invalidation
  },

  // Configuration des métriques
  METRICS: {
    COLLECT_RESOURCE_TIMING: true,
    COLLECT_NAVIGATION_TIMING: true,
    COLLECT_MEMORY_STATS: true
  },

  // Configuration des erreurs
  ERROR_TRACKING: {
    MAX_ERRORS: 100,  // Nombre maximum d'erreurs à stocker
    IGNORE_PATTERNS: [
      'ResizeObserver loop limit exceeded',
      'Script error.'
    ]
  }
};