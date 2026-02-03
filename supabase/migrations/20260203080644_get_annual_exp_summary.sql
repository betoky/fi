CREATE OR REPLACE FUNCTION get_annual_exp_summary(p_year INT)
RETURNS TABLE (
    month TEXT,
    total NUMERIC
)
LANGUAGE sql
SET search_path TO 'pg_catalog', 'pg_temp'
AS $$
    WITH months AS (
        SELECT generate_series(
            make_date(p_year, 1, 1),
            make_date(p_year, 12, 1),
            INTERVAL '1 month'
        ) AS start
    )
    SELECT
        TO_CHAR(m.start, 'MM-YYYY') AS month,
        COALESCE(SUM(e.amount), null) AS total
    FROM months m
    LEFT JOIN public.expenses e
        ON e.date >= m.start AND e.date <  m.start + INTERVAL '1 month'
    GROUP BY m.start
    ORDER BY m.start;
$$;