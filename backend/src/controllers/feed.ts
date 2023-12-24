import { Request, Response, NextFunction } from 'express';
import { query } from '../database/db'

// function to get the expenses
export const getExpenseCategories = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query('SELECT category_id,type_name FROM expense_types');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching expense categories' });
  }
};

// Function to create expenses
export const createTransaction = async (req: Request, res: Response, _next: NextFunction) => {
  const { date, amount, typeId } = req.body; // Assuming these are the fields you're sending
  
  try {
    const result = await query('INSERT INTO transactions (date, amount, type_id) VALUES ($1, $2, $3) RETURNING *', [date, amount, typeId]);
    res.status(201).json({
      message: 'Transaction created successfully!',
      transaction: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving transaction to database' });
  }
};

// function to get timeseris
export const getTimeSeries = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(`SELECT sum(t.amount) AS total, \
                                TO_CHAR(t.date, 'YYYY-MM') AS time, \
                                ec.category_name FROM transactions t \
                                JOIN expense_categories ec ON ec.id = t.type_id \
                                GROUP BY 2,3`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching timeseries' });
  }
};