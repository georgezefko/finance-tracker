import express from 'express';
import * as networthController from './networth.controller';
import isAuth from '../../middleware/is-auth';

const router = express.Router();



// POST /api/networth/transactions
router.post('/transactions', isAuth, networthController.createNetworthTransaction);

export default router;