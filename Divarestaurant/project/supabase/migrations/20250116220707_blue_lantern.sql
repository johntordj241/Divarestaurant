-- Correction de la fonction get_basic_statistics pour utiliser CAST
CREATE OR REPLACE FUNCTION get_basic_statistics(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- Ajout d'un délai de timeout plus long
  SET LOCAL statement_timeout = '30s';
  
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
    'averageGuests', (SELECT CAST(avg_guests_per_reservation AS numeric(10,2)) FROM stats),
    'reservations', (SELECT total_reservations FROM stats),
    'conversionRate', (SELECT CAST(conversion_rate AS numeric(10,2)) FROM stats),
    'averageTicket', (SELECT CAST(avg_ticket AS numeric(10,2)) FROM revenue_stats)
  ) INTO result;

  RETURN result;
END;
$$;