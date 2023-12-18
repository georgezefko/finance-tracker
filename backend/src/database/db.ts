import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'tracker',
  password: process.env.DB_PASS,
  port: 5432,
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params || []);
  };