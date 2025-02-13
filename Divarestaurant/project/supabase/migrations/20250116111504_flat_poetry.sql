/*
  # Configuration des tables médias et contenu

  1. Nouvelles Tables
    - `media` : Stockage des médias (images et vidéos)
    - `content` : Gestion du contenu du site
  
  2. Sécurité
    - Activation RLS sur toutes les tables
    - Politiques d'accès pour les utilisateurs authentifiés
*/

-- Table pour les médias
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('image', 'video')) NOT NULL,
  size integer NOT NULL,
  location text CHECK (location IN ('hero', 'gallery', 'shows')) NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour le contenu
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text CHECK (type IN ('page', 'article', 'news')) NOT NULL,
  content text NOT NULL,
  status text CHECK (status IN ('draft', 'published', 'scheduled')) NOT NULL,
  author text NOT NULL,
  publish_date timestamptz,
  meta_title text,
  meta_description text,
  keywords text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Politiques pour media
CREATE POLICY "Les médias sont visibles par tous"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent ajouter des médias"
  ON media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent modifier des médias"
  ON media FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent supprimer des médias"
  ON media FOR DELETE
  USING (auth.role() = 'authenticated');

-- Politiques pour content
CREATE POLICY "Le contenu publié est visible par tous"
  ON content FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent créer du contenu"
  ON content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent modifier le contenu"
  ON content FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent supprimer du contenu"
  ON content FOR DELETE
  USING (auth.role() = 'authenticated');

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();