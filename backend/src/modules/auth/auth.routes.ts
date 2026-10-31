import express from 'express';
import * as authController from './auth.controller';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// POST /api/auth/
router.post('/signup', authController.signup);


// POST /api/auth/
router.post('/login', authController.login);

// POST /api/auth/mcp-token
router.post('/mcp-token', isAuth, authController.createMcpToken);

export default router; 