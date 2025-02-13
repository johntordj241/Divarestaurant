/*
  # Add versions table for changelog

  1. New Tables
    - `versions`
      - `id` (uuid, primary key)
      - `number` (text, version number)
      - `title` (text, optional version title)
      - `date` (timestamptz, release date)
      - `status` (text, version status)
      - `sections` (jsonb, version changes by section)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `versions` table
    - Add policy for public read access
*/

-- Create versions table
CREATE TABLE IF NOT EXISTS versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  title text,
  date timestamptz NOT NULL,
  status text CHECK (status IN ('stable', 'beta', 'alpha')) NOT NULL,
  sections jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Versions are viewable by everyone"
  ON versions FOR SELECT
  USING (true);

-- Add sample version
INSERT INTO versions (number, title, date, status, sections) VALUES
(
  '1.0.0',
  'Version initiale',
  now(),
  'stable',
  '[
    {
      "title": "Fonctionnalités",
      "changes": [
        "Système de réservation en ligne",
        "Gestion des menus dynamique",
        "Intégration des paiements Stripe",
        "Notifications automatiques"
      ]
    },
    {
      "title": "Améliorations",
      "changes": [
        "Interface utilisateur responsive",
        "Optimisation des performances",
        "Support multilingue (FR/EN)"
      ]
    }
  ]'::jsonb
);