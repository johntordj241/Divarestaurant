-- Ajout du champ total_price aux réservations
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS total_price numeric DEFAULT 0;

-- Mise à jour des total_price existants
WITH menu_prices AS (
  SELECT 
    id::text as menu_id,
    price
  FROM menu_items
)
UPDATE reservations r
SET total_price = (
  SELECT COALESCE(SUM(mp.price), 0)
  FROM menu_prices mp
  WHERE mp.menu_id = ANY(r.menu_ids)
) * r.number_of_guests;

-- Fonction pour calculer automatiquement le total_price
CREATE OR REPLACE FUNCTION calculate_reservation_total()
RETURNS TRIGGER AS $$
BEGIN
  WITH menu_prices AS (
    SELECT 
      id::text as menu_id,
      price
    FROM menu_items
  )
  SELECT COALESCE(SUM(mp.price), 0) * NEW.number_of_guests
  INTO NEW.total_price
  FROM menu_prices mp
  WHERE mp.menu_id = ANY(NEW.menu_ids);
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement le total_price
CREATE TRIGGER update_reservation_total
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE PROCEDURE calculate_reservation_total();