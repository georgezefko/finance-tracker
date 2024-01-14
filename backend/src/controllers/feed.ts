import { Request, Response, NextFunction } from 'express';
import { query } from '../database/db'

// function to get the expenses
export const getExpenseCategories = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query('SELECT id, category_id, type_name FROM expense_types');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching expense categories' });
  }
};

// Function to create expenses
export const createTransaction = async (req: Request, res: Response, _next: NextFunction) => {
  const { date, amount, typeId, categoryId } = req.body; // Assuming these are the fields you're sending
  
  try {
    const result = await query('INSERT INTO transactions (date, amount, type_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [date, amount, typeId, categoryId]);
    res.status(201).json({
      message: 'Transaction created successfully!',
      transaction: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving transaction to database' });
  }
};

// function to get timeseries
export const getTimeSeries = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
      `SELECT 
        SUM(t.amount) AS total, 
        TO_CHAR(t.date, 'YYYY-MM') AS time,
        et.type_name
      FROM transactions t
      JOIN expense_types et on et.id = t.type_id 
      WHERE et.type_name not in ('Salary' ,'Bonus')
      GROUP BY 2,3`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching timeseries' });
  }
};

// function to get income/expenses
export const getIncomeExpenses = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
      `WITH cat AS(
        SELECT 
          id,
        CASE 
          WHEN category_name <> 'Income' then 'Expense'
          ELSE 'Income'
        END as names
        FROM expense_categories
      )
      SELECT 
        sum(t.amount) AS total, 
        TO_CHAR(t.date, 'YYYY') AS time,
        ec.names 
      FROM transactions t 
      JOIN cat ec ON ec.id = t.category_id 
      GROUP BY 2,3`
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching income/expenses' });
  }
};


// function to get cashflow
export const getCasflow = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
      `SELECT 
        ec.category_name,
        et.type_name,
        TO_CHAR(t.date, 'Month') as month, 
        SUM(t.amount) as total_amount
      FROM transactions t
      JOIN expense_types et ON et.id = t.type_id
      JOIN expense_categories ec ON ec.id=t.category_id
      GROUP BY 1, 2, 3
      ORDER BY ec.category_name, month`
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching casflow' });
  }
};