/*
  # Ajout des tables d'analytics

  1. Nouvelles Tables
    - analytics_events : Stockage des événements d'analytics
    - error_logs : Stockage des logs d'erreurs
  
  2. Sécurité
    - Enable RLS sur les tables
    - Politiques d'accès pour les utilisateurs authentifiés
*/

-- Table des événements d'analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  page_url text,
  created_at timestamptz DEFAULT now()
);

-- Table des logs d'erreurs
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  error_stack text,
  context jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  page_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour analytics_events
CREATE POLICY "Les événements peuvent être insérés par tous les utilisateurs"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Les événements sont visibles par les administrateurs"
  ON analytics_events FOR SELECT
  USING (auth.jwt() ->> 'email' = 'admin@diva-restaurant.com');

-- Politiques pour error_logs
CREATE POLICY "Les erreurs peuvent être insérées par tous les utilisateurs"
  ON error_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Les erreurs sont visibles par les administrateurs"
  ON error_logs FOR SELECT
  USING (auth.jwt() ->> 'email' = 'admin@diva-restaurant.com');

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at 
  ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name 
  ON analytics_events(event_name);

CREATE INDEX IF NOT EXISTS idx_error_logs_created_at 
  ON error_logs(created_at DESC);