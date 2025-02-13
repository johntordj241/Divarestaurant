-- Table des abonnés à la newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text CHECK (status IN ('active', 'unsubscribed')) NOT NULL DEFAULT 'active',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Newsletter subscribers can be created by anyone"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Newsletter subscribers are viewable by authenticated users"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
  ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status 
  ON newsletter_subscribers(status);