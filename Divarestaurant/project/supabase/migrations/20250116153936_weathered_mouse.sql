/*
  # Système d'inventaire et de gestion des menus

  1. Nouvelles Tables
    - `inventory`
      - Gestion des stocks d'ingrédients
      - Suivi des quantités et seuils minimums
      - Prix et fournisseurs
    - `inventory_movements`
      - Historique des mouvements de stock
      - Traçabilité des entrées/sorties
    - `suppliers`
      - Gestion des fournisseurs
      - Coordonnées et informations de contact

  2. Sécurité
    - RLS activé sur toutes les tables
    - Accès restreint aux utilisateurs authentifiés
*/

-- Table pour l'inventaire
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL,
  minimum_quantity numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  supplier text NOT NULL,
  price_per_unit numeric NOT NULL,
  last_order_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les mouvements de stock
CREATE TABLE IF NOT EXISTS inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES inventory(id),
  quantity numeric NOT NULL,
  type text CHECK (type IN ('in', 'out')) NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table pour les fournisseurs
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policies pour inventory
CREATE POLICY "Inventory is viewable by authenticated users"
  ON inventory FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Inventory is editable by authenticated users"
  ON inventory FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies pour inventory_movements
CREATE POLICY "Movements are viewable by authenticated users"
  ON inventory_movements FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Movements are insertable by authenticated users"
  ON inventory_movements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policies pour suppliers
CREATE POLICY "Suppliers are viewable by authenticated users"
  ON suppliers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Suppliers are editable by authenticated users"
  ON suppliers FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Fonction pour mettre à jour le stock
CREATE OR REPLACE FUNCTION update_inventory_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'in' THEN
    UPDATE inventory
    SET quantity = quantity + NEW.quantity
    WHERE id = NEW.inventory_id;
  ELSE
    UPDATE inventory
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.inventory_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement les quantités
CREATE TRIGGER update_inventory_on_movement
  AFTER INSERT ON inventory_movements
  FOR EACH ROW
  EXECUTE PROCEDURE update_inventory_quantity();