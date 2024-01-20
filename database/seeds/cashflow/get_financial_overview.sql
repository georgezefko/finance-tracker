CREATE OR REPLACE FUNCTION get_financial_metrics()
RETURNS TABLE(
    report_month TEXT,
    total_income_value DECIMAL,
    expense_category VARCHAR,
    total_expense_value DECIMAL,
    net_income_value DECIMAL,
    savings_rate_value DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH category_totals AS (
    SELECT 
        ec.category_name,
        TO_CHAR(t.date, 'YYYY-MM') AS month,
        SUM(t.amount) AS total_amount,
        CASE 
            WHEN ec.category_name = 'Income' THEN 'Income'
            ELSE 'Expense'
        END AS type
    FROM transactions t
    JOIN expense_categories ec ON t.category_id = ec.id
    GROUP BY ec.category_name, TO_CHAR(t.date, 'YYYY-MM')
    ),
    income_total AS (
        SELECT 
            month,
            SUM(total_amount) AS total_income
        FROM category_totals
        WHERE type = 'Income'
        GROUP BY month
    ),
    expense_total AS (
        SELECT 
            month,
            category_name,
            SUM(total_amount) AS total_expense
        FROM category_totals
        WHERE type = 'Expense'
        GROUP BY month, category_name
    ),
    net_income AS (
        SELECT 
            i.month,
            (i.total_income - COALESCE(SUM(e.total_expense), 0)) AS total_net_income
        FROM income_total i
        LEFT JOIN expense_total e ON i.month = e.month
        GROUP BY i.month, i.total_income
    )
    SELECT 
        i.month AS report_month,
        i.total_income AS total_income_value,
        e.category_name AS expense_category,
        e.total_expense AS total_expense_value,
        n.total_net_income AS net_income_value,
        (n.total_net_income / NULLIF(i.total_income, 0)) * 100 AS savings_rate_value
    FROM income_total i
    LEFT JOIN expense_total e ON i.month = e.month
    LEFT JOIN net_income n ON i.month = n.month
    ORDER BY i.month, e.category_name;
END;
$$ LANGUAGE plpgsql;