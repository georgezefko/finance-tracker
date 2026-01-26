import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: isProd
    ? { rejectUnauthorized: false } // Neon, managed DBs
    : false, 
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params || []);
  };