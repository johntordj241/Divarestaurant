```markdown
# API Documentation - La Diva Cabaret

## Authentification

### POST /auth/signup
Création d'un nouveau compte.

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string"
  },
  "session": {
    "access_token": "string"
  }
}
```

### POST /auth/signin
Connexion à un compte existant.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "session": {
    "access_token": "string",
    "expires_at": "number"
  }
}
```

## Réservations

### POST /api/reservations
Création d'une nouvelle réservation.

**Request:**
```json
{
  "date": "string",
  "time": "string",
  "guests": "number",
  "menu_ids": "string[]",
  "special_requests": "string?"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "pending | confirmed",
  "total_price": "number"
}
```

### GET /api/reservations/:id
Récupération des détails d'une réservation.

**Response:**
```json
{
  "id": "string",
  "date": "string",
  "time": "string",
  "guests": "number",
  "status": "string",
  "menu_items": "array",
  "total_price": "number"
}
```

## Menus

### GET /api/menus
Liste des menus disponibles.

**Query Parameters:**
- `category`: Filtrer par catégorie
- `available`: Filtrer par disponibilité

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "category": "string",
      "available": "boolean"
    }
  ]
}
```

## Statistiques

### GET /api/statistics
Statistiques globales.

**Query Parameters:**
- `start_date`: Date de début
- `end_date`: Date de fin

**Response:**
```json
{
  "revenue": "number",
  "reservations": "number",
  "average_guests": "number",
  "popular_times": "array"
}
```

## Erreurs

### Format des erreurs
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object?"
  }
}
```

### Codes d'erreur communs
- `400`: Requête invalide
- `401`: Non authentifié
- `403`: Non autorisé
- `404`: Ressource non trouvée
- `429`: Trop de requêtes
- `500`: Erreur serveur
```