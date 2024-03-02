import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: 'tracker',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params || []);
  };