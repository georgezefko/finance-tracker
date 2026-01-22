import express from 'express';
import * as feedController from './cashflow.controller';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// Get /api/cashflow/expense-categories
router.get('/expense-categories', feedController.getExpenseCategories);

// POST /api/cashflow/transaction
router.post('/transaction', isAuth, feedController.createTransaction);

// Get /api/cashflow/timeseries
router.get('/timeseries', isAuth, feedController.getTimeSeries);

// Get /api/cashflow/income-expenses
router.get('/income-expenses', isAuth, feedController.getIncomeExpenses);

// Get /api/cashflow/casflow
router.get('/casflow', isAuth, feedController.getCasflow);

// Get /api/cashflow/financial-overview
router.get('/financial-overview', isAuth, feedController.getFinancialOverview);

// Get /api/cashflow/financial-details
router.get('/financial-details', isAuth, feedController.getFinancialDetails);

// Get /api/cashflow/list-expenses
router.get('/list-expenses', isAuth, feedController.getExpenseTable);

// Get /api/cashflow/financial-month
//router.get('/financial-month', feedController.getFinancialDetails);
export default router;
