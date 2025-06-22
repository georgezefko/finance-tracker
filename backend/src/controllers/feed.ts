import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as feedService from '../services/feed.service';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const transactionSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    amount: z.number(),
    typeId: z.number(),
    categoryId: z.number(),
});

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

// function to get timeseries
export const getTimeSeries = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        const result = await feedService.getTimeSeries(userId);
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
        const result = await feedService.getIncomeExpenses(userId);
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
        const result = await feedService.getCasflow(userId);
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
        const result = await feedService.getFinancialOverview(userId);
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
        const result = await feedService.getFinancialDetails(userId);
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
        const result = await feedService.getExpenseTable(userId);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
};