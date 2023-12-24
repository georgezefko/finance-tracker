import express from 'express';
import * as feedController from '../controllers/feed';

const router= express.Router()

// Get /feed/expense-categories
router.get('/expense-categories', feedController.getExpenseCategories);

// POST /feed/transaction
router.post('/transaction', feedController.createTransaction);

// Get /feed/timeseries
router.get('/timeseries', feedController.getTimeSeries);
export default router;
