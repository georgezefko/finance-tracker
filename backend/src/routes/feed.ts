import express from 'express';
import * as feedController from '../controllers/feed';
import isAuth from '../middleware/is-auth';

const router = express.Router();

// Get /feed/expense-categories
router.get('/expense-categories', feedController.getExpenseCategories);

// POST /feed/transaction
router.post('/transaction', isAuth, feedController.createTransaction);

// Get /feed/timeseries
router.get('/timeseries', isAuth, feedController.getTimeSeries);

// Get /feed/income-expenses
router.get('/income-expenses', isAuth, feedController.getIncomeExpenses);

// Get /feed/casflow
router.get('/casflow', isAuth, feedController.getCasflow);

// Get /feed/financial-overview
router.get('/financial-overview', isAuth, feedController.getFinancialOverview);

// Get /feed/financial-details
router.get('/financial-details', isAuth, feedController.getFinancialDetails);

// Get /feed/list-expenses
router.get('/list-expenses', isAuth, feedController.getExpenseTable);

// Get /feed/financial-month
//router.get('/financial-month', feedController.getFinancialDetails);
export default router;
