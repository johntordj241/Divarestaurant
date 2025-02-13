/*
  # Ajout des tables pour la gestion des réservations

  1. Nouvelles Tables
    - `tables` : Tables du restaurant
    - `reservations` : Réservations des clients
    - `scheduled_reminders` : Rappels automatiques
  
  2. Relations
    - Réservation -> Table
    - Réservation -> Rappels
  
  3. Sécurité
    - RLS sur toutes les tables
    - Politiques pour les utilisateurs authentifiés
*/

-- Tables du restaurant
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL,
  section text NOT NULL,
  is_vip boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Réservations
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time time NOT NULL,
  number_of_guests integer NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  table_id uuid REFERENCES tables(id),
  menu_ids text[] NOT NULL,
  special_requests text,
  status text CHECK (status IN ('pending', 'confirmed', 'cancelled')) NOT NULL DEFAULT 'pending',
  payment_status text CHECK (payment_status IN ('pending', 'paid', 'refunded')) NOT NULL DEFAULT 'pending',
  notes jsonb DEFAULT '[]'::jsonb,
  modification_history jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rappels automatiques
CREATE TABLE IF NOT EXISTS scheduled_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  scheduled_for timestamptz NOT NULL,
  type text NOT NULL,
  status text CHECK (status IN ('pending', 'sent', 'failed')) NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for tables
CREATE POLICY "Tables are viewable by everyone" 
  ON tables FOR SELECT 
  USING (true);

CREATE POLICY "Tables are editable by authenticated users" 
  ON tables FOR ALL 
  USING (auth.role() = 'authenticated');

-- Policies for reservations
CREATE POLICY "Reservations are viewable by authenticated users" 
  ON reservations FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Reservations are editable by authenticated users" 
  ON reservations FOR ALL 
  USING (auth.role() = 'authenticated');

-- Policies for scheduled_reminders
CREATE POLICY "Reminders are viewable by authenticated users" 
  ON scheduled_reminders FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Reminders are editable by authenticated users" 
  ON scheduled_reminders FOR ALL 
  USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample tables
INSERT INTO tables (name, capacity, section) VALUES
  ('A1', 4, 'A'),
  ('A2', 4, 'A'),
  ('B1', 6, 'B'),
  ('B2', 6, 'B'),
  ('VIP1', 8, 'VIP')
ON CONFLICT DO NOTHING;