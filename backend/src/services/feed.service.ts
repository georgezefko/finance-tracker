import { query } from '../db_conn/db';

export const getExpenseCategories = () => {
    return query('SELECT id, category_id, type_name FROM expense_types');
};

export const createTransaction = (date: string, amount: number, typeId: number, categoryId: number, userId: string) => {
    return query(
        'INSERT INTO transactions (date, amount, type_id, category_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [date, amount, typeId, categoryId, userId]
    );
};

export const getTimeSeries = (userId: string) => {
    return query(
      `SELECT 
        SUM(t.amount) AS total, 
        TO_CHAR(t.date, 'YYYY-MM') AS time,
        et.type_name
      FROM transactions t
      JOIN expense_types et on et.id = t.type_id 
      WHERE et.type_name not in ('Salary' ,'Bonus', 'Rent')
      AND TO_CHAR(t.date, 'YYYY') > '2024'
      AND t.user_id = $1
      GROUP BY 2,3`,
      [userId]
    );
};

export const getIncomeExpenses = (userId: string) => {
    // This seems to call a SQL function. We'll assume it's adapted to use user_id.
    // In a real scenario, you'd update the get_income_expense() function in Postgres.
    return query('SELECT * FROM get_income_expense($1)', [userId]);
};

export const getCasflow = (userId: string) => {
    return query(
      `SELECT 
        ec.category_name,
        et.type_name,
        TO_CHAR(t.date, 'Month') as month, 
        SUM(t.amount) as total_amount
      FROM transactions t
      JOIN expense_types et ON et.id = t.type_id
      JOIN expense_categories ec ON ec.id=t.category_id
      WHERE TO_CHAR(t.date, 'YYYY') > '2024'
      AND t.user_id = $1
      GROUP BY 1, 2, 3
      ORDER BY ec.category_name, month`,
      [userId]
    );
};

export const getFinancialOverview = (userId: string) => {
    // This seems to call a SQL function. We'll assume it's adapted to use user_id.
    return query('SELECT * from get_financial_metrics($1)', [userId]);
};

export const getFinancialDetails = (userId: string) => {
    return query(
      `SELECT
        TO_CHAR(t.date, 'YYYY-MM') as dates, 
        ec.category_name as category, 
        SUM(t.amount) as amount
      FROM transactions t 
      JOIN expense_categories ec ON ec.id = t.category_id 
      WHERE ec.category_name != 'Income'
      AND TO_CHAR(t.date, 'YYYY') > '2024'
      AND t.user_id = $1
      GROUP BY 1,2
      ORDER BY SUM(t.amount) DESC`,
      [userId]
    );
};

export const getExpenseTable = (userId: string) => {
    return query(
      `SELECT  
        TO_CHAR(t.date, 'YYYY-MM-DD') as date,
        t.amount,
        et.type_name as type,
        ec.category_name as category
      FROM transactions t
      INNER JOIN expense_categories ec ON ec.id = t.category_id 
      INNER JOIN expense_types et on et.id = t.type_id 
      WHERE ec.category_name != 'Income'
      AND TO_CHAR(t.date, 'YYYY') > '2024'
      AND t.user_id = $1
      ORDER BY TO_CHAR(t.date, 'YYYY-MM-DD') desc`,
      [userId]
    );
}; 