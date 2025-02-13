-- Modification de la fonction get_menu_statistics pour gérer correctement les menu_ids
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
  SELECT 
    m.id::text,
    m.name,
    COUNT(*)::bigint as order_count,
    SUM(r.total_price)::numeric as total_revenue
  FROM menu_items m
  JOIN reservations r ON r.status = 'confirmed'
    AND r.date BETWEEN start_date AND end_date
  WHERE m.id::text = ANY(r.menu_ids)
  GROUP BY m.id, m.name
  ORDER BY total_revenue DESC
  LIMIT 10;
END;
$$;

-- Mise à jour de la fonction get_basic_statistics pour éviter les erreurs de conversion
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
      COALESCE(SUM(number_of_guests), 0) as total_guests,
      COALESCE(AVG(number_of_guests), 0) as avg_guests_per_reservation,
      COALESCE(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) * 100, 0) as conversion_rate
    FROM reservations
    WHERE date BETWEEN start_date AND end_date
  ),
  revenue_stats AS (
    SELECT
      COALESCE(SUM(total_price), 0) as total_revenue,
      COALESCE(AVG(total_price), 0) as avg_ticket
    FROM reservations
    WHERE status = 'confirmed'
    AND date BETWEEN start_date AND end_date
  ),
  prev_period_revenue AS (
    SELECT COALESCE(SUM(total_price), 0) as prev_revenue
    FROM reservations
    WHERE status = 'confirmed'
    AND date BETWEEN start_date - (end_date - start_date) AND start_date
  )
  SELECT json_build_object(
    'revenue', (SELECT total_revenue FROM revenue_stats),
    'revenueComparison', CASE 
      WHEN (SELECT prev_revenue FROM prev_period_revenue) > 0 
      THEN ((SELECT total_revenue FROM revenue_stats) - (SELECT prev_revenue FROM prev_period_revenue)) / (SELECT prev_revenue FROM prev_period_revenue) * 100
      ELSE 0 
    END,
    'totalGuests', (SELECT total_guests FROM stats),
    'averageGuests', ROUND((SELECT avg_guests_per_reservation FROM stats), 2),
    'reservations', (SELECT total_reservations FROM stats),
    'conversionRate', ROUND((SELECT conversion_rate FROM stats), 2),
    'averageTicket', ROUND((SELECT avg_ticket FROM revenue_stats), 2)
  ) INTO result;

  RETURN result;
END;
$$;