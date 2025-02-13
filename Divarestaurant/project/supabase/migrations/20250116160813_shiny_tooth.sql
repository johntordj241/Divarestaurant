-- Fonction pour les statistiques de base
CREATE OR REPLACE FUNCTION get_basic_statistics(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  WITH stats AS (
    SELECT
      COUNT(*) as total_reservations,
      SUM(number_of_guests) as total_guests,
      AVG(number_of_guests) as avg_guests_per_reservation,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) * 100 as conversion_rate
    FROM reservations
    WHERE date BETWEEN start_date AND end_date
  ),
  revenue_stats AS (
    SELECT
      SUM(total_price) as total_revenue,
      AVG(total_price) as avg_ticket
    FROM reservations
    WHERE status = 'confirmed'
    AND date BETWEEN start_date AND end_date
  ),
  prev_period_revenue AS (
    SELECT SUM(total_price) as prev_revenue
    FROM reservations
    WHERE status = 'confirmed'
    AND date BETWEEN start_date - (end_date - start_date) AND start_date
  )
  SELECT json_build_object(
    'revenue', COALESCE((SELECT total_revenue FROM revenue_stats), 0),
    'revenueComparison', CASE 
      WHEN (SELECT prev_revenue FROM prev_period_revenue) > 0 
      THEN ((SELECT total_revenue FROM revenue_stats) - (SELECT prev_revenue FROM prev_period_revenue)) / (SELECT prev_revenue FROM prev_period_revenue) * 100
      ELSE 0 
    END,
    'totalGuests', COALESCE((SELECT total_guests FROM stats), 0),
    'averageGuests', ROUND(COALESCE((SELECT avg_guests_per_reservation FROM stats), 0), 2),
    'reservations', COALESCE((SELECT total_reservations FROM stats), 0),
    'conversionRate', ROUND(COALESCE((SELECT conversion_rate FROM stats), 0), 2),
    'averageTicket', ROUND(COALESCE((SELECT avg_ticket FROM revenue_stats), 0), 2)
  ) INTO result;

  RETURN result;
END;
$$;

-- Fonction pour les statistiques des menus
CREATE OR REPLACE FUNCTION get_menu_statistics(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS TABLE (
  menu_id text,
  name text,
  count bigint,
  revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH menu_orders AS (
    SELECT 
      m.id,
      m.name,
      COUNT(*) as order_count,
      COUNT(*) * m.price as total_revenue
    FROM menu_items m
    JOIN reservations r ON m.id = ANY(r.menu_ids)
    WHERE r.status = 'confirmed'
    AND r.date BETWEEN start_date AND end_date
    GROUP BY m.id, m.name, m.price
  )
  SELECT 
    mo.id::text,
    mo.name,
    mo.order_count,
    mo.total_revenue
  FROM menu_orders mo
  ORDER BY mo.total_revenue DESC
  LIMIT 10;
END;
$$;

-- Fonction pour les créneaux horaires populaires
CREATE OR REPLACE FUNCTION get_popular_time_slots(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS TABLE (
  time_slot text,
  reservations bigint,
  occupancy_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH time_slots AS (
    SELECT 
      time::text as slot,
      COUNT(*) as reservation_count,
      SUM(number_of_guests) as total_guests,
      (SELECT SUM(capacity) FROM tables) as total_capacity
    FROM reservations
    WHERE status = 'confirmed'
    AND date BETWEEN start_date AND end_date
    GROUP BY time
  )
  SELECT 
    ts.slot,
    ts.reservation_count,
    ROUND((ts.total_guests::numeric / NULLIF(ts.total_capacity, 0)) * 100, 2) as occupancy
  FROM time_slots ts
  ORDER BY ts.reservation_count DESC
  LIMIT 5;
END;
$$;

-- Accorder les privilèges nécessaires
GRANT EXECUTE ON FUNCTION get_basic_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION get_menu_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_time_slots TO authenticated;