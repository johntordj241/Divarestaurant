-- Ajout de données de test pour les statistiques

-- Ajout de réservations
INSERT INTO reservations (
  date,
  time,
  number_of_guests,
  customer_name,
  customer_email,
  customer_phone,
  menu_ids,
  status,
  payment_status
) VALUES
  -- Aujourd'hui
  (CURRENT_DATE, '19:00', 4, 'Jean Dupont', 'jean@example.com', '+33612345678', ARRAY['menu-1'], 'confirmed', 'paid'),
  (CURRENT_DATE, '19:30', 2, 'Marie Martin', 'marie@example.com', '+33687654321', ARRAY['menu-2'], 'confirmed', 'paid'),
  (CURRENT_DATE, '20:00', 6, 'Pierre Durand', 'pierre@example.com', '+33611223344', ARRAY['menu-1', 'menu-2'], 'confirmed', 'paid'),
  -- Hier
  (CURRENT_DATE - 1, '19:00', 2, 'Sophie Bernard', 'sophie@example.com', '+33699887766', ARRAY['menu-2'], 'confirmed', 'paid'),
  (CURRENT_DATE - 1, '20:30', 4, 'Lucas Petit', 'lucas@example.com', '+33622334455', ARRAY['menu-1'], 'confirmed', 'paid'),
  -- Cette semaine
  (CURRENT_DATE - 2, '19:30', 8, 'Emma Dubois', 'emma@example.com', '+33633445566', ARRAY['menu-1', 'menu-2'], 'confirmed', 'paid'),
  (CURRENT_DATE - 3, '20:00', 2, 'Thomas Leroy', 'thomas@example.com', '+33644556677', ARRAY['menu-2'], 'confirmed', 'paid'),
  (CURRENT_DATE - 4, '19:00', 4, 'Julie Moreau', 'julie@example.com', '+33655667788', ARRAY['menu-1'], 'confirmed', 'paid'),
  -- En attente
  (CURRENT_DATE + 1, '19:00', 2, 'Antoine Roux', 'antoine@example.com', '+33666778899', ARRAY['menu-2'], 'pending', 'pending'),
  (CURRENT_DATE + 2, '20:00', 6, 'Claire Simon', 'claire@example.com', '+33677889900', ARRAY['menu-1'], 'pending', 'pending');

-- Ajout de menus
INSERT INTO menu_items (
  name,
  description,
  price,
  category_id,
  is_vegetarian,
  is_gluten_free,
  available
) VALUES
  ('Menu Classique', 'Entrée, plat, dessert avec accord mets et vins', 85, (SELECT id FROM menu_categories LIMIT 1), false, false, true),
  ('Menu Végétarien', 'Sélection raffinée de plats végétariens', 75, (SELECT id FROM menu_categories LIMIT 1), true, false, true),
  ('Menu Prestige', 'Champagne, caviar et mets d''exception', 150, (SELECT id FROM menu_categories LIMIT 1), false, false, true);

-- Ajout de tables
INSERT INTO tables (name, capacity, section) VALUES
  ('A1', 4, 'A'),
  ('A2', 4, 'A'),
  ('B1', 6, 'B'),
  ('B2', 6, 'B'),
  ('VIP1', 8, 'VIP')
ON CONFLICT DO NOTHING;