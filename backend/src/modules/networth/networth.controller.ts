import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import * as networthService from './networth.service';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const transactionSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    amount: z.number(),
    typeId: z.number(),
    categoryId: z.number(),
    institutionId: z.number(),
});


// function to add networth trasaction
export const createNetworthTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { date, amount, typeId, categoryId, institutionId } = transactionSchema.parse(req.body);
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        
        const result = await networthService.createNetworthTransaction(date, amount, typeId, categoryId, institutionId, userId);
        return res.status(201).json({
            message: 'Transaction created successfully!',
            transaction: result.rows[0],
        });
    } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json({
            message: 'Invalid request body',
            errors: err.errors,
          });
        }
        return next(err);
      }
};

// function to get the categories
export const getNetworthCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const rows = await networthService.getNetworthCategories();
        return res.status(200).json(rows);
    } catch (err) {
        next(err);
        return;
    }
};


// function to get the MoM, YTD and Total networth
export const getNetworthSummary = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated.' });
      }
      const year =
        typeof req.query.year === 'string'
            ? parseInt(req.query.year, 10)
            : new Date().getFullYear();
  
      const points = await networthService.getNetworthSummary(userId, year);
  
      if (points.length === 0) {
        return res.status(200).json({
          currentNetworth: 0,
          momChange: null,
          momChangePct: null,
          ytdChange: null,
          ytdChangePct: null,
        });
      }
  
      // Points are sorted ASC by date
      const latest = points[points.length - 1];
      const latestDate = new Date(latest.date);
      const currentNetworth = latest.networth;
  
      // ---- Month-over-Month ----
      let momChange: number | null = null;
      let momChangePct: number | null = null;
  
      if (points.length > 1) {
        const previous = points[points.length - 2]; // for now we assume monthly snapshots
        momChange = currentNetworth - previous.networth;
        momChangePct =
          previous.networth !== 0 ? momChange / previous.networth : null;
      }
  
      // ---- Year-to-Date ----
      let ytdChange: number | null = null;
      let ytdChangePct: number | null = null;

      const currentYear = latestDate.getFullYear();

      const firstOfYear = points.find((p) => {
      const d = new Date(p.date);
        return d.getFullYear() === currentYear;
    });

       if (firstOfYear) {
         ytdChange = currentNetworth - firstOfYear.networth;

         if (firstOfYear.networth !== 0) {
            ytdChangePct = ytdChange / firstOfYear.networth;
        }
    }
  
      return res.status(200).json({
        currentNetworth,
        momChange,
        momChangePct,
        ytdChange,
        ytdChangePct,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid request',
          errors: err.errors,
        });
      }
      return next(err);
    }
  };

export const getNetworthAllocation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated.' });
      }
  
      const now = new Date();
      const yearParam = req.query.year as string | undefined;
      const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
  
      const rows = await networthService.getNetworthAllocationForYear(userId,year);
  
      return res.status(200).json(rows);
    } catch (err) {
      return next(err);
    }
  };

