import express from 'express';
import * as feedController from '../controllers/feed';

const router= express.Router()

// Get /feed/expense-categories
router.get('/expense-categories', feedController.getExpenseCategories);

// POST /feed/transaction
router.post('/transaction', feedController.createTransaction);

// Get /feed/timeseries
router.get('/timeseries', feedController.getTimeSeries);

// Get /feed/income-expenses
router.get('/income-expenses', feedController.getIncomeExpenses);

// Get /feed/casflow
router.get('/casflow', feedController.getCasflow);

// Get /feed/financial-overview
router.get('/financial-overview', feedController.getFinancialOverview);


// Get /feed/financial-details
router.get('/financial-details', feedController.getFinancialDetails);

// Get /feed/list-expenses
router.get('/list-expenses', feedController.getExpenseTable);



// Get /feed/financial-month
//router.get('/financial-month', feedController.getFinancialDetails);
export default router;
