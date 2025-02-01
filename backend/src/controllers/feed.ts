import { Request, Response, NextFunction } from 'express';
import { query } from '../db_conn/db'

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
      WHERE et.type_name not in ('Salary' ,'Bonus', 'Rent')
      AND TO_CHAR(t.date, 'YYYY') > '2024'
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
      ` SELECT * FROM get_income_expense()`
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
      WHERE TO_CHAR(t.date, 'YYYY') > '2024'
      GROUP BY 1, 2, 3
      ORDER BY ec.category_name, month`
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching casflow' });
  }
};

// function to get financial Overview
export const getFinancialOverview = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
      `SELECT * from get_financial_metrics()`
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching financial overview' });
  }
};


// function to get stack bar plot
export const getFinancialDetails = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
      `SELECT
        TO_CHAR(t.date, 'YYYY-MM') as dates, 
        ec.category_name as category, 
        SUM(t.amount) as amount
      FROM transactions t 
      JOIN expense_categories ec ON ec.id = t.category_id 
      WHERE ec.category_name != 'Income'
      AND TO_CHAR(t.date, 'YYYY') > '2024'
      GROUP BY 1,2
      ORDER BY SUM(t.amount) DESC
      `
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching financial details' });
  }
};


// function to get income/exp/save per month
export const getOverallMonth = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
      `
      SELECT
        TO_CHAR(t.date, 'YYYY-MM') date,
        SUM(CASE WHEN ec.category_name = 'Income' THEN t.amount ELSE 0 END) as income,
        SUM(CASE WHEN ec.category_name != 'Income' THEN t.amount ELSE 0 END) as expense,
        (SUM(CASE WHEN ec.category_name = 'Income' THEN t.amount ELSE 0 END) - 
        SUM(CASE WHEN ec.category_name != 'Income' THEN t.amount ELSE 0 END)) as savings
      FROM
        transactions t
      JOIN
        expense_categories ec ON ec.id = t.category_id
      WHERE TO_CHAR(t.date, 'YYYY') > '2024'
      GROUP BY
        TO_CHAR(t.date, 'YYYY-MM')
      ORDER BY
        TO_CHAR(t.date, 'YYYY-MM');
      `
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching financial overview' });
  }
};


// function to get income/exp/save per month
export const getExpenseTable = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query(
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
      ORDER BY TO_CHAR(t.date, 'YYYY-MM-DD') desc
      `
      );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching expenses list' });
  }
};