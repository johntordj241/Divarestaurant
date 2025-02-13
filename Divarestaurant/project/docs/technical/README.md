# Documentation Technique - La Diva Cabaret

## Architecture

### Frontend
- React 18 avec TypeScript
- Vite pour le bundling
- TailwindCSS pour le styling
- Lucide React pour les icônes
- PWA pour le support offline

### Backend
- Supabase pour la base de données et l'authentification
- Stripe pour les paiements
- Service workers pour le cache et le offline

### Services
- NotificationService pour les emails et SMS
- PerformanceMonitor pour le monitoring
- StatisticsService pour les analytics
- CacheService pour le offline

## API Reference

### Endpoints

#### Réservations
```typescript
POST /api/reservations
GET /api/reservations/:id
PUT /api/reservations/:id
DELETE /api/reservations/:id
```

#### Menus
```typescript
GET /api/menus
GET /api/menus/:id
```

#### Authentification
```typescript
POST /auth/signup
POST /auth/signin
POST /auth/signout
```

## Performance

### Optimisations
- Code splitting
- Lazy loading des images
- Cache des requêtes API
- Service worker pour le offline
- Compression des assets

### Monitoring
- Métriques de performance
- Logs d'erreurs
- Analytics utilisateur
- Suivi des performances API

## Sécurité
- HTTPS obligatoire
- Protection CSRF
- Rate limiting
- Validation des données
- Sanitization des inputs

## Tests
- Tests unitaires (Vitest)
- Tests d'intégration
- Tests de charge (k6)
- Tests de performance
- Tests E2E (Cypress)