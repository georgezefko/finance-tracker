import { query } from '../db_conn/db';
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}; 