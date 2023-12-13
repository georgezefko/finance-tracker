import express from 'express';
import * as feedController from '../controllers/feed';

const router= express.Router()

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', feedController.createPost);

export default router;
