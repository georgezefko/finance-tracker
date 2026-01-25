import express from 'express';
import * as authController from './auth.controller';

const router = express.Router();

// POST /api/auth/
router.post('/signup', authController.signup);


// POST /api/auth/
router.post('/login', authController.login);

export default router; 