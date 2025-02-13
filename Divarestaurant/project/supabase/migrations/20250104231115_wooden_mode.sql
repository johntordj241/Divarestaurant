/*
  # Add more changelog versions
  
  1. New Data
    - Adds multiple versions with detailed changelogs
    - Includes different types of changes (features, fixes, improvements)
    
  2. Changes
    - Adds more recent versions
    - Includes detailed change descriptions
*/

INSERT INTO versions (number, title, date, status, sections) VALUES
(
  '1.1.0',
  'Amélioration de l''expérience utilisateur',
  now() - interval '7 days',
  'stable',
  '[
    {
      "title": "Nouvelles fonctionnalités",
      "changes": [
        "Ajout du système de notifications en temps réel",
        "Nouveau design pour la page de réservation",
        "Support des paiements Apple Pay et Google Pay"
      ]
    },
    {
      "title": "Améliorations",
      "changes": [
        "Performance optimisée du chargement des images",
        "Meilleure gestion des erreurs de paiement",
        "Interface adaptative pour tous les écrans"
      ]
    },
    {
      "title": "Corrections",
      "changes": [
        "Correction du bug d''affichage sur Safari",
        "Résolution des problèmes de validation des formulaires",
        "Correction des erreurs de calcul des prix"
      ]
    }
  ]'::jsonb
),
(
  '1.0.1',
  'Corrections et optimisations',
  now() - interval '14 days',
  'stable',
  '[
    {
      "title": "Corrections",
      "changes": [
        "Correction des problèmes de réservation multiple",
        "Résolution du bug d''affichage du calendrier",
        "Correction des erreurs de validation d''email"
      ]
    },
    {
      "title": "Optimisations",
      "changes": [
        "Amélioration des temps de chargement",
        "Réduction de la consommation de données",
        "Optimisation du cache des images"
      ]
    }
  ]'::jsonb
),
(
  '0.9.0',
  'Version bêta publique',
  now() - interval '30 days',
  'beta',
  '[
    {
      "title": "Fonctionnalités bêta",
      "changes": [
        "Première version du système de réservation",
        "Interface de gestion des menus",
        "Système de paiement en test"
      ]
    },
    {
      "title": "Notes",
      "changes": [
        "Version de test pour validation des concepts",
        "Certaines fonctionnalités peuvent être instables",
        "Retours utilisateurs bienvenus"
      ]
    }
  ]'::jsonb
);