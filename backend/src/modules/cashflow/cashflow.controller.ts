import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as feedService from './cashflow.service';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const transactionSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    amount: z.number(),
    typeId: z.number(),
    categoryId: z.number(),
});

// Bounded to the int4 range so an out-of-range id is a clean 422, not a DB 500.
const idParamSchema = z.coerce.number().int().positive().max(2147483647);



// function to get the expenses
export const getExpenseCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await feedService.getExpenseCategories();
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};

// Function to create expenses
export const createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { date, amount, typeId, categoryId } = transactionSchema.parse(req.body);
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        
        const result = await feedService.createTransaction(date, amount, typeId, categoryId, userId);
        return res.status(201).json({
            message: 'Transaction created successfully!',
            transaction: result.rows[0],
        });
    } catch (err) {
        next(err);
        return;
    }
};

// Function to update an existing transaction (scoped to the owner)
export const updateTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        const id = idParamSchema.parse(req.params.id);
        const { date, amount, typeId, categoryId } = transactionSchema.parse(req.body);

        const result = await feedService.updateTransaction(id, date, amount, typeId, categoryId, userId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        return res.status(200).json({
            message: 'Transaction updated successfully!',
            transaction: result.rows[0],
        });
    } catch (err) {
        next(err);
        return;
    }
};

// Function to delete a transaction (scoped to the owner)
export const deleteTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        const id = idParamSchema.parse(req.params.id);

        const result = await feedService.deleteTransaction(id, userId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        return res.status(200).json({ message: 'Transaction deleted successfully!' });
    } catch (err) {
        next(err);
        return;
    }
};

// function to get timeseries
export const getTimeSeries = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
        const result = await feedService.getTimeSeries(userId, year);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};

// function to get income/expenses
export const getIncomeExpenses = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
        const result = await feedService.getIncomeExpenses(userId, year);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};

// function to get cashflow
export const getCasflow = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
        const result = await feedService.getCasflow(userId, year);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};

// function to get financial Overview
export const getFinancialOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
        const result = await feedService.getFinancialOverview(userId, year);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};

// function to get stack bar plot
export const getFinancialDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
        const result = await feedService.getFinancialDetails(userId, year);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};

// function to get income/exp/save per month
export const getExpenseTable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
        const result = await feedService.getExpenseTable(userId, year);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};


// function to get available years
export const getAvailableYears = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated.' });
      }
  
      const result = await feedService.getAvailableYears(userId);
      // result.rows: [{ year: 2025 }, { year: 2024 }, ...]
      return res.status(200).json(result.rows.map(r => r.year));
    } catch (err) {
      next(err);
      return;
    }
  };
