-- Table des candidatures (skip if exists)
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

-- Enable RLS (safe to run multiple times)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Applications can be created by anyone" ON applications;
  DROP POLICY IF EXISTS "Applications are viewable by authenticated users" ON applications;
  DROP POLICY IF EXISTS "Applications are editable by authenticated users" ON applications;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Applications can be created by anyone"
  ON applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Applications are viewable by authenticated users"
  ON applications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Applications are editable by authenticated users"
  ON applications FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;

-- Create trigger for updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_applications_status;
DROP INDEX IF EXISTS idx_applications_submitted_at;

-- Create indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS notify_application_received();

-- Create function for notifications
CREATE OR REPLACE FUNCTION notify_application_received()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    message,
    data
  )
  SELECT 
    id,
    'new_application',
    'Nouvelle candidature reçue : ' || NEW.first_name || ' ' || NEW.last_name,
    jsonb_build_object(
      'application_id', NEW.id,
      'specialty', NEW.specialty
    )
  FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS notify_on_application ON applications;

-- Create trigger for notifications
CREATE TRIGGER notify_on_application
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE PROCEDURE notify_application_received();