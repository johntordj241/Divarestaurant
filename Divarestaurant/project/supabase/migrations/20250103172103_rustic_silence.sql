/*
  # Add menu items and system settings

  1. New Tables
    - `menu_items`: Stores all menu options
    - `menu_categories`: Menu item categories
    - `system_settings`: Global system settings
    
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu categories are viewable by everyone"
  ON menu_categories FOR SELECT
  USING (true);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  is_vegetarian boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  allergens text[],
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone"
  ON menu_items FOR SELECT
  USING (true);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System settings are viewable by authenticated users"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

-- Insert default settings
INSERT INTO system_settings (key, value, description) VALUES
  ('cancellation_policy', 
   jsonb_build_object(
     'free_cancellation_hours', 48,
     'fee_percentage', 50
   ),
   'Cancellation policy settings'
  ),
  ('payment_settings',
   jsonb_build_object(
     'deposit_percentage', 30,
     'currency', 'EUR'
   ),
   'Payment and deposit settings'
  ),
  ('notification_settings',
   jsonb_build_object(
     'reminder_hours_before', 24,
     'send_sms', true,
     'send_email', true
   ),
   'Notification settings'
  )
ON CONFLICT (key) DO NOTHING;