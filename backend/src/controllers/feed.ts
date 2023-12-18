import { Request, Response, NextFunction } from 'express';
import { query } from '../database/db'

export const getPosts = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post!' }]
  });
};

export const createPost = async (req: Request, res: Response, _next: NextFunction) => {
  const title = req.body.title;
  const content = req.body.content;
  
  try {
    const result = await query('INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
    res.status(201).json({
      message: 'Post created successfully!',
      post: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving post to database' });
  }
};

export const getExpenseCategories = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const result = await query('SELECT type_name FROM expense_types');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching expense categories' });
  }
};
