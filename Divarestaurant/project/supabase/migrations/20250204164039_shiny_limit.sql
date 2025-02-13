-- Table des candidatures
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  specialty text NOT NULL,
  experience text NOT NULL,
  portfolio text NOT NULL,
  availability text NOT NULL,
  message text,
  status text CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) NOT NULL DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Applications can be created by anyone"
  ON applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Applications are viewable by authenticated users"
  ON applications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Applications are editable by authenticated users"
  ON applications FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);