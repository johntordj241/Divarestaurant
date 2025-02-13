-- Create shows table
CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  image_url text,
  artist text,
  is_special_event boolean DEFAULT false,
  price numeric NOT NULL,
  available_seats integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Shows are viewable by everyone"
  ON shows FOR SELECT
  USING (true);

-- Create policy for admin write access
CREATE POLICY "Shows are editable by authenticated users"
  ON shows FOR ALL
  USING (auth.role() = 'authenticated');

-- Add some sample data
INSERT INTO shows (
  title,
  description,
  date,
  time,
  image_url,
  artist,
  is_special_event,
  price,
  available_seats
) VALUES
  (
    'Soirée Jazz & Gastronomie',
    'Une soirée exceptionnelle mêlant jazz live et cuisine raffinée',
    CURRENT_DATE + interval '1 day',
    '19:30',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    'Jazz Quartet',
    true,
    150,
    40
  ),
  (
    'Cabaret Classique',
    'Notre spectacle signature avec les artistes de la maison',
    CURRENT_DATE + interval '2 days',
    '20:00',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
    'Troupe Diva',
    false,
    85,
    60
  ),
  (
    'Soirée Piano Bar',
    'Une ambiance feutrée avec notre pianiste virtuose',
    CURRENT_DATE + interval '3 days',
    '19:00',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    'Marie Laurent',
    false,
    95,
    30
  );

-- Create index for date-based queries
CREATE INDEX idx_shows_date ON shows(date);

-- Create function to update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();