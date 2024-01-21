DROP FUNCTION IF EXISTS get_financial_metrics();

CREATE OR REPLACE FUNCTION get_financial_metrics()
RETURNS TABLE(
    report_month TEXT,
    total_income_value DECIMAL,
    expense_category VARCHAR,
    total_expense_value DECIMAL,
    total_monthly_expenses DECIMAL,
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
    monthly_expenses AS (
        SELECT
            month,
            SUM(total_expense) AS total_monthly_expenses
        FROM expense_total
        GROUP BY month
    ),
    net_income AS (
        SELECT 
            i.month,
            (i.total_income - COALESCE(m.total_monthly_expenses, 0)) AS total_net_income
        FROM income_total i
        JOIN monthly_expenses m ON i.month = m.month
    )
    SELECT 
        i.month AS report_month,
        i.total_income AS total_income_value,
        e.category_name AS expense_category,
        e.total_expense AS total_expense_value,
        m.total_monthly_expenses AS total_monthly_expenses,
        n.total_net_income AS net_income_value,
        (n.total_net_income / NULLIF(i.total_income, 0)) * 100 AS savings_rate_value
    FROM income_total i
    JOIN expense_total e ON i.month = e.month
    JOIN monthly_expenses m ON i.month = m.month
    JOIN net_income n ON i.month = n.month
    ORDER BY i.month, e.category_name;
END;
$$ LANGUAGE plpgsql;
