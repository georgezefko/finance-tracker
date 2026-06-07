import { query } from '../../db_conn/db';

export const getExpenseCategories = () => {
    return query('SELECT id, category_id, type_name FROM expense_types');
};

export const createTransaction = (date: string, amount: number, typeId: number, categoryId: number, userId: string) => {
    return query(
        'INSERT INTO transactions (date, amount, type_id, category_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [date, amount, typeId, categoryId, userId]
    );
};

// Scoped by user_id so a user can only update their own transactions.
export const updateTransaction = (id: number, date: string, amount: number, typeId: number, categoryId: number, userId: string) => {
    return query(
        `UPDATE transactions
         SET date = $1, amount = $2, type_id = $3, category_id = $4
         WHERE id = $5 AND user_id = $6
         RETURNING *`,
        [date, amount, typeId, categoryId, id, userId]
    );
};

// Scoped by user_id so a user can only delete their own transactions.
export const deleteTransaction = (id: number, userId: string) => {
    return query(
        'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
};

export const getTimeSeries = (userId: string, year:number) => {
    return query(
      `SELECT 
        SUM(t.amount) AS total, 
        TO_CHAR(t.date, 'YYYY-MM') AS time,
        et.type_name
      FROM transactions t
      JOIN expense_types et on et.id = t.type_id 
      WHERE et.type_name not in ('Salary' ,'Bonus', 'Rent')
      AND EXTRACT(YEAR FROM t.date)::int = $2
      AND t.user_id = $1
      GROUP BY 2,3`,
      [userId, year]

    );
};

export const getIncomeExpenses = (userId: string, year:number) => {
    // This seems to call a SQL function. We'll assume it's adapted to use user_id.
    // In a real scenario, you'd update the get_income_expense() function in Postgres.
    return query('SELECT * FROM get_income_expense($1, $2)', [userId, year]);
};

export const getCasflow = (userId: string, year:number) => {
    return query(
      `SELECT 
        ec.category_name,
        et.type_name,
        TO_CHAR(t.date, 'Month') as month, 
        SUM(t.amount) as total_amount
      FROM transactions t
      JOIN expense_types et ON et.id = t.type_id
      JOIN expense_categories ec ON ec.id=t.category_id
      WHERE EXTRACT(YEAR FROM t.date)::int = $2
      AND t.user_id = $1
      GROUP BY 1, 2, 3
      ORDER BY ec.category_name, month`,
      [userId, year]
    );
};

export const getFinancialOverview = (userId: string, year:number) => {
    // This seems to call a SQL function. We'll assume it's adapted to use user_id.
    return query('SELECT * from get_financial_metrics($1, $2)', [userId, year]);
};

export const getFinancialDetails = (userId: string, year:number) => {
    return query(
      `SELECT
        TO_CHAR(t.date, 'YYYY-MM') as dates, 
        ec.category_name as category, 
        SUM(t.amount) as amount
      FROM transactions t 
      JOIN expense_categories ec ON ec.id = t.category_id 
      WHERE ec.category_name != 'Income'
      AND EXTRACT(YEAR FROM t.date)::int = $2
      AND t.user_id = $1
      GROUP BY 1,2
      ORDER BY SUM(t.amount) DESC`,
      [userId, year]
    );
};

export const getExpenseTable = (userId: string, year: number) => {
    return query(
      `SELECT
        t.id,
        to_char(t.date, 'YYYY-MM-DD') AS date,
        t.amount,
        et.type_name as type,
        t.type_id,
        ec.category_name as category,
        t.category_id
      FROM transactions t
      INNER JOIN expense_categories ec ON ec.id = t.category_id 
      INNER JOIN expense_types et on et.id = t.type_id 
      WHERE ec.category_name != 'Income'
      AND EXTRACT(YEAR FROM t.date)::int = $2
      AND t.user_id = $1
      ORDER BY t.date DESC`,
      [userId, year]
    );
}; 


export const getAvailableYears = (userId: string) => {
  return query(
    `
    SELECT DISTINCT
      EXTRACT(YEAR FROM date)::int AS year
    FROM transactions
    WHERE user_id = $1
    ORDER BY year DESC
    `,
    [userId]
  );
};