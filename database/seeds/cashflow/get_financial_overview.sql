DROP FUNCTION IF EXISTS get_financial_metrics(INT);

CREATE OR REPLACE FUNCTION get_financial_metrics(p_user_id INT)
RETURNS TABLE(
    report_year TEXT,
    total_income_value DECIMAL,
    expense_category VARCHAR,
    total_expense_value DECIMAL,
    total_yearly_expenses DECIMAL,
    net_income_value DECIMAL,
    cumulative_net_income_value DECIMAL,
    savings_rate_value DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH category_totals AS (
        SELECT 
            ec.category_name,
            TO_CHAR(t.date, 'YYYY') AS year,
            SUM(t.amount) AS total_amount,
            CASE 
                WHEN ec.category_name = 'Income' THEN 'Income'
                ELSE 'Expense'
            END AS type
        FROM transactions t
        JOIN expense_categories ec ON t.category_id = ec.id
        WHERE t.user_id = p_user_id
        AND TO_CHAR(t.date, 'YYYY') > '2024' --TO REMOVE
        GROUP BY ec.category_name, TO_CHAR(t.date, 'YYYY')
    ),
    income_total AS (
        SELECT 
            year,
            SUM(total_amount) AS total_income
        FROM category_totals
        WHERE type = 'Income'
        GROUP BY year
    ),
    expense_total AS (
        SELECT 
            year,
            category_name,
            SUM(total_amount) AS total_expense
        FROM category_totals
        WHERE type = 'Expense'
        GROUP BY year, category_name
    ),
    yearly_expenses AS (
        SELECT
            year,
            SUM(total_expense) AS total_yearly_expenses
        FROM expense_total
        GROUP BY year
    ),
    net_income AS (
        SELECT 
            i.year,
            (i.total_income - COALESCE(m.total_yearly_expenses, 0)) AS total_net_income
        FROM income_total i
        JOIN yearly_expenses m ON i.year = m.year
    ),
      cumulative_net_income AS (
        SELECT 
            year,
            SUM(total_net_income) OVER (ORDER BY year) AS cumulative_income
        FROM net_income
    )
    SELECT 
        i.year AS report_year,
        i.total_income AS total_income_value,
        e.category_name AS expense_category,
        (e.total_expense / NULLIF(i.total_income, 0)) * 100 AS total_expense_value,
        (m.total_yearly_expenses / NULLIF(i.total_income, 0)) * 100 AS total_yearly_expenses,
        n.total_net_income  AS net_income_value,
        c.cumulative_income AS cumulative_net_income_value, 
        (n.total_net_income / NULLIF(i.total_income, 0)) * 100 AS savings_rate_value
    FROM income_total i
    JOIN expense_total e ON i.year = e.year
    JOIN yearly_expenses m ON i.year = m.year
    JOIN net_income n ON i.year = n.year
    JOIN cumulative_net_income c ON i.year = c.year
    ORDER BY i.year, e.category_name;
END;
$$ LANGUAGE plpgsql;
