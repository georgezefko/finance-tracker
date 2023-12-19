import express from 'express';
import * as feedController from '../controllers/feed';

const router= express.Router()

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', feedController.createPost);

// Get /feed/expense-categories
router.get('/expense-categories', feedController.getExpenseCategories);

// POST /feed/transaction
router.post('/transaction', feedController.createTransaction);


export default router;
