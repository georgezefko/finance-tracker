import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ZodError } from 'zod';
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
        next(err);
      }
};
