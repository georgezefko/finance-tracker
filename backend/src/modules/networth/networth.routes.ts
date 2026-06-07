import express from 'express';
import * as networthController from './networth.controller';
import isAuth from '../../middleware/is-auth';

const router = express.Router();



// POST /api/networth/transactions
router.post('/transactions', isAuth, networthController.createNetworthTransaction);

// GET /api/networth/list-transactions
router.get('/list-transactions', isAuth, networthController.getNetworthTable);

// PATCH /api/networth/transactions/:id
router.patch('/transactions/:id', isAuth, networthController.updateNetworthTransaction);

// DELETE /api/networth/transactions/:id
router.delete('/transactions/:id', isAuth, networthController.deleteNetworthTransaction);

// GET /api/networth/summary
router.get('/summary', isAuth, networthController.getNetworthSummary);


// GET /api/networth/type-institutions
router.get('/type-institutions', isAuth, networthController.getNetworthCategories);

// GET /api/networth/allocation
router.get('/allocation', isAuth, networthController.getNetworthAllocation);

export default router;